export default function VideoPlayer({ src }: { src: string }) {
  return (
    <video controls className="w-full mt-4">
      <source src={`/api/video?path=${encodeURIComponent(src)}`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};