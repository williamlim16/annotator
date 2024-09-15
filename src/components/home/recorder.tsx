import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { useState } from "react";
import { FrameRange } from "./video-player";
import { checkPath, loadJSON } from "~/app/actions/files";

type FrameStart = Omit<FrameRange, 'end_frame'>;
// const data: JSONDataStructure = {
//   "incorrect_location": [
//     {
//       "id": 5,
//       "start_frame": 2,
//       "end_frame": 5
//     },
//     {
//       "id": 6,
//       "start_frame": 6,
//       "end_frame": 7
//     },
//   ],
//   "duplicate": [
//     {
//       "id": 1,
//       "start_frame": 1,
//       "end_frame": 2
//     },
//   ]
// };

type JSONDataStructure = {
  incorrect_location: FrameRange[];
  duplicate: FrameRange[];
};

export default function Recorder() {
  const [dataPath, setDataPath] = useState<string>('');
  const [dataPathOK, setDataPathOK] = useState<boolean>(false);
  const [records, setRecords] = useState<FrameStart[]>([]);
  const [data, setData] = useState<JSONDataStructure>({
    incorrect_location: [],
    duplicate: []
  });

  const handleCheckPath = async () => {
    const isValid = await checkPath(dataPath);
    setDataPathOK(isValid);
    if (isValid) {
      const data = await loadJSON(dataPath);
      setData(data);
    }
  };


  return (
    <div>
      {dataPathOK === false ? (<>
        <div>
          <Input type="text" value={dataPath} onChange={(e) => setDataPath(e.target.value)} />
          <Button onClick={handleCheckPath}>Check</Button>
        </div>
      </>) : (
        <Dialog>
          <DialogTrigger className="w-full" asChild>
            <Button variant="outline" className="w-full">Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recording Annotations</DialogTitle>
              <DialogDescription>
                Record annotations for the video
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Person ID
                </Label>
                <Input id="person_id" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Start Frame
                </Label>
                <Input id="start_frame" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full">Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>

  )
}