import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "~/components/ui/dialog";
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
import { useToast } from "~/hooks/use-toast";

export type FrameRange = {
  id: number;
  start_frame: number;
  end_frame: number;
};

type FrameStart = Omit<FrameRange, 'end_frame'>;

export type JSONDataStructure = {
  incorrect_location: FrameRange[];
  duplicate: FrameRange[];
};

export default function Recorder() {
  const { toast } = useToast();
  const [dataPath, setDataPath] = useState<string>('');
  const [dataPathOK, setDataPathOK] = useState<boolean>(false);
  const [records, setRecords] = useState<FrameStart[]>([]);
  const [endFrames, setEndFrames] = useState<{ [key: string]: number }>({});
  const [data, setData] = useState<JSONDataStructure>({
    incorrect_location: [],
    duplicate: []
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personId, setPersonId] = useState<number>(0);
  const [startFrame, setStartFrame] = useState<number>(0);

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

  const handleRecord = () => {
    setDialogOpen(false);
    toast({
      title: 'Record Annotation',
      description: (
        <div className="mt-2 flex flex-col space-y-2">
          <div>Person ID: {personId}</div>
          <div>Start Frame: {startFrame}</div>
        </div>
      ),
      duration: 3000,
    });
    const newRecord = { id: personId, start_frame: startFrame };
    setRecords([...records, newRecord]);
    setEndFrames({ ...endFrames, [`${personId}-${startFrame}`]: 0 });
  };

  const handleEndFrameChange = (recordId: string, value: number) => {
    setEndFrames({ ...endFrames, [recordId]: value });
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <Input id="person_id" type="number" value={personId} onChange={(e) => setPersonId(parseInt(e.target.value))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Start Frame
                </Label>
                <Input id="start_frame" type="number" value={startFrame} onChange={(e) => setStartFrame(parseInt(e.target.value))} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button className="w-full" onClick={handleRecord}>Record Data</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex flex-col space-y-2 p-4">
        <div>Current Recording: </div>
        {records.map((record) => {
          const recordId = `${record.id}-${record.start_frame}`;
          return (
            <div key={recordId} className="grid grid-cols-5 gap-4 items-center">
              <div className="col-span-1">ID: {record.id}</div>
              <div className="col-span-1">Start: {record.start_frame}</div>
              <Input
                type="number"
                value={endFrames[recordId] || ''}
                onChange={(e) => handleEndFrameChange(recordId, parseInt(e.target.value))}
                className="col-span-1"
                placeholder="End Frame"
              />
              <Button variant="outline" className="col-span-1">Location</Button>
              <Button variant="outline" className="col-span-1">Duplicate</Button>
            </div>
          );
        })}
      </div>
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