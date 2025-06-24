import Balance from "../components/Balance";
import Graph from "@/components/Graph";

function App() {
    return (
        <div className="flex flex-col justify-between items-center min-h-screen bg-black py-6">
            <h1 className="text-3xl font-bold">My Wallet</h1>
            <div className="w-full h-[60vh] md:h-[75vh] px-4">
                    <Graph />
            </div>

            <Balance />
        </div>
    );
}

export default App;
