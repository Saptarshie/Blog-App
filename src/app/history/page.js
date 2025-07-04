import HistoryList from "@/components/history-list";

export default function HistoryPage() {
    return (
        <section className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Here&apos;s the list of Your Xs
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
                <HistoryList />
            </div>
        </section>
    )
}