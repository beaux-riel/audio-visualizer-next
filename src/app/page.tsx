import AudioVisualizer from "../components/AudioVisualizer";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8">
        <AudioVisualizer />
      </div>
    </main>
  );
}
