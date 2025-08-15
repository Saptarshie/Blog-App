"""
lightweight_embeddings.py

Requirements (from your requirements.txt you already have):
  - sentence-transformers  (optional; only if you use method='model')
  - numpy

Two embedding methods:
  - method='model' : uses a local sentence-transformers model (all-MiniLM-L6-v2 -> 384d) and
                     optional dimensionality reduction via deterministic random projection.
  - method='hash'  : pure-python deterministic hash-based embedding (no external models/downloads).

Functions:
  - embed(text, method='model', dim=128, model_name='all-MiniLM-L6-v2')
  - embed_batch(list[str], ...)
"""

from __future__ import annotations
import hashlib
import math
import threading
from typing import List
import numpy as np

# Optional import (only required for model-based embeddings)
try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover
    SentenceTransformer = None  # type: ignore

# ---- Globals for model caching ----
_model_lock = threading.Lock()
_EMBED_MODEL = None  # type: SentenceTransformer | None

def _load_model(model_name: str = "all-MiniLM-L6-v2"):
    """Load and cache the SentenceTransformer model (thread-safe)."""
    global _EMBED_MODEL
    if SentenceTransformer is None:
        raise RuntimeError(
            "sentence-transformers is not installed or failed to import. "
            "Install with `pip install sentence-transformers` to use method='model'."
        )
    with _model_lock:
        if _EMBED_MODEL is None or getattr(_EMBED_MODEL, "name", "") != model_name:
            _EMBED_MODEL = SentenceTransformer(model_name)
        return _EMBED_MODEL

# ---- Utilities ----
def _l2_normalize(v: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(v)
    return v / (norm + 1e-12)

def _deterministic_random_projection_matrix(src_dim: int, tgt_dim: int, seed: int) -> np.ndarray:
    """Construct a deterministic Gaussian random projection matrix."""
    rng = np.random.RandomState(seed)
    # Using Gaussian entries; this is small and fast. We scale by sqrt(1/tgt_dim) to keep lengths stable.
    mat = rng.normal(loc=0.0, scale=1.0, size=(src_dim, tgt_dim))
    mat *= (1.0 / math.sqrt(tgt_dim))
    return mat

# ---- Hash-based embedding (fallback, dependency-free) ----
def _hash_embedding(text: str, dim: int = 128) -> np.ndarray:
    """
    Deterministic hash-based embedding:
      - tokenize simply by whitespace and character ngrams
      - accumulate hashed token contributions into a vector of length `dim`
    Very fast, no external model, lower quality — good as a cheap fallback.
    """
    text = text or ""
    tokens = text.split()
    if len(tokens) == 0:
        tokens = [text]

    vec = np.zeros(dim, dtype=np.float32)
    for token in tokens:
        # combine token with different suffixes to spread over dimensions
        for i in range(3):  # a few lightweight ngrams / variations
            s = f"{token}|{i}"
            digest = hashlib.sha256(s.encode("utf8")).digest()
            # use digest bytes to update multiple dimensions
            for j in range(dim):
                b = digest[j % len(digest)]
                # map byte to [-0.5, 0.5]
                val = (b / 255.0) - 0.5
                vec[j] += val
    # normalize and return
    return _l2_normalize(vec.astype(np.float32))

# ---- Main embedding function ----
def embed(
    text: str,
    method: str = "model",
    dim: int = 128,
    model_name: str = "all-MiniLM-L6-v2",
    rp_seed: int | None = None,
) -> List[float]:
    """
    Compute an embedding for `text`.

    Parameters
    ----------
    text : str
        Input text.
    method : {'model', 'hash'}
        'model' uses sentence-transformers locally (recommended).
        'hash' uses a deterministic local hashing scheme (no downloads).
    dim : int
        Target embedding dimension (must be > 0). If using 'model' and dim < model_dim,
        we project down with a deterministic random projection. If dim == model_dim, keep as is.
    model_name : str
        HF/sentence-transformers model name to load when method == 'model'.
        Default 'all-MiniLM-L6-v2' => 384 dims, small & fast.
    rp_seed : int | None
        Optional seed for the random projection; if None we derive one deterministically from model_name+dim.

    Returns
    -------
    List[float]
        L2-normalized embedding of length `dim`.
    """
    if dim <= 0:
        raise ValueError("dim must be > 0")

    if method == "hash":
        vec = _hash_embedding(text, dim=dim)
        return vec.tolist()

    if method == "model":
        if SentenceTransformer is None:
            # explicit instruction when package missing
            raise RuntimeError(
                "sentence-transformers is not available. Install it with:\n"
                "  pip install sentence-transformers\n"
                "Then you can call embed(..., method='model')."
            )
        model = _load_model(model_name)
        # sentence-transformers returns numpy array
        raw = model.encode([text], show_progress_bar=False, convert_to_numpy=True)[0]
        raw = np.asarray(raw, dtype=np.float32)
        src_dim = raw.shape[0]

        if dim == src_dim:
            return _l2_normalize(raw).tolist()

        # reduce dimension deterministically with a small random projection matrix
        if rp_seed is None:
            # derive seed deterministically from model_name + target dim
            seed_source = f"{model_name}::{dim}"
            rp_seed = int(hashlib.sha256(seed_source.encode("utf8")).hexdigest()[:8], 16)

        proj = _deterministic_random_projection_matrix(src_dim, dim, seed=rp_seed)  # shape (src_dim, dim)
        reduced = np.dot(raw, proj)  # -> (dim,)
        reduced = _l2_normalize(reduced.astype(np.float32))
        return reduced.tolist()

    raise ValueError("method must be one of {'model', 'hash'}")

# ---- Batch helper ----
def embed_batch(
    texts: List[str],
    method: str = "model",
    dim: int = 128,
    model_name: str = "all-MiniLM-L6-v2",
    rp_seed: int | None = None,
) -> List[List[float]]:
    """
    Embed a list of texts. Uses model.encode in batch if available (fast).
    """
    if method == "hash":
        return [_hash_embedding(t, dim=dim).tolist() for t in texts]

    if method == "model":
        if SentenceTransformer is None:
            raise RuntimeError("sentence-transformers is not installed.")
        model = _load_model(model_name)
        raws = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
        src_dim = raws.shape[1]
        if dim == src_dim:
            return [ (_l2_normalize(raw).tolist()) for raw in raws ]
        if rp_seed is None:
            seed_source = f"{model_name}::{dim}"
            rp_seed = int(hashlib.sha256(seed_source.encode("utf8")).hexdigest()[:8], 16)
        proj = _deterministic_random_projection_matrix(src_dim, dim, seed=rp_seed)
        reduced = np.dot(raws, proj)
        return [ _l2_normalize(r).tolist() for r in reduced ]

# ---- Quick demonstration / test ----
if __name__ == "__main__":
    sample = "This is a test sentence for embeddings."
    print("Hash method (128d):", len(embed(sample, method="hash", dim=128)))
    try:
        print("Model method -> project to 128d (all-MiniLM-L6-v2):")
        v = embed(sample, method="model", dim=128)
        print(" length:", len(v), "norm:", np.linalg.norm(v))
    except Exception as e:
        print("Model embedding failed (maybe missing package or network):", e)
