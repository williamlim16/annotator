import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { checkPath, loadJSON } from "~/app/actions/files";
import DataTable from "./data-table";
import { columns } from "./columns";
import Cookies from 'js-cookie';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

export type FrameRange = {
  id: number;
  start_frame: number;
  end_frame: number;
};

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

export type JSONDataStructure = {
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

  const SavePath = useCallback(() => {
    Cookies.set('jsonPath', dataPath)
  }, [dataPath])

  useEffect(() => {
    const savedPath = Cookies.get('jsonPath');
    if (savedPath) {
      setDataPath(savedPath);
    }
  }, []);

  const handleCheckPath = async () => {
    const isValid = await checkPath(dataPath);
    setDataPathOK(isValid);
    if (isValid) {
      const loadedData = await loadJSON(dataPath);
      setData(loadedData);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {dataPathOK === false ? (
        <div className="flex flex-col space-y-2 p-4">
          <Input type="text" value={dataPath} onChange={(e) => setDataPath(e.target.value)} className="w-full" />
          <div className="flex gap-2 ">
            <Button onClick={handleCheckPath} className="w-1/2">Check</Button>
            <Button onClick={SavePath} variant="outline" className="w-1/2">Save</Button>
          </div>
        </div>
      ) : (
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
      <div className="overflow-y-auto flex-grow pt-4 w-full">
        <Tabs defaultValue="incorrect_location" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="incorrect_location" className="flex-1">Incorrect Location</TabsTrigger>
            <TabsTrigger value="duplicate" className="flex-1">Duplicate</TabsTrigger>
          </TabsList>
          <TabsContent value="incorrect_location">
            <DataTable columns={columns} data={data.incorrect_location} />
          </TabsContent>
          <TabsContent value="duplicate">
            <DataTable columns={columns} data={data.duplicate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}