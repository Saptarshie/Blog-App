
// Make server component work with client component
export async function getServerSideProps() {
  // This will run on the server
  const { fetchUserAction } = await import('@/action');
  const res = await fetchUserAction();
  
  return {
    props: {
      initialData: res
    }
  };
}
