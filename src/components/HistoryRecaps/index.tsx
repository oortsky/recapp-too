import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { searchName } from "@/utils/searchName";
import { searchIncome } from "@/utils/searchIncome";
import { dateReadable } from "@/utils/dateReadable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateAPI, deleteAPI } from "@/lib/api";

type Recap = {
  id: number;
  amount: number;
  type: number;
  date: string;
  income: number;
};

type Type = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  recaps: Recap[];
  types: Type[];
};

export default function HistoryRecaps({ recaps, types }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<number | undefined>();
  const [amount, setAmount] = useState<number | undefined>();

  const handleSelectType = (value: string) => {
    setSelectedType(value ? parseInt(value) : undefined);
  };

  const handleDialog = (id: number) => {
    const data = recaps.find(recap => recap.id === id);
    if (data) {
      setAmount(data.amount);
      setSelectedType(data.type);
      setSelectedDate(new Date(data.date));
    }
  };

  const handleUpdate = async (id: number) => {
    if (!selectedDate || selectedType === undefined || amount === undefined)
      return;

    const adjustedDate = new Date(selectedDate);
    adjustedDate.setHours(12, 0, 0, 0);

    const data = {
      amount: Number(amount),
      type: selectedType,
      date: adjustedDate.toISOString().split("T")[0],
      income: searchIncome(selectedType, Number(amount), types)
    };

    try {
      const response = await updateAPI("recaps", id, data);
      setAmount(undefined);
      setSelectedType(undefined);
      setSelectedDate(undefined);
      console.log("Data updated:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAPI("recaps", id);
      console.log("Data deleted:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recap History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40 rounded-md border">
          <div className="p-4">
            {recaps
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map(recap => (
                <div key={recap.id}>
                  <div className="flex">
                    <div className="w-full">
                      <div className="flex justify-between text-sm pb-2">
                        <p>
                          {recap.amount} <span className="text-xs">pcs</span>
                        </p>
                        <p>
                          {recap.income.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}
                        </p>
                      </div>
                      <div className="text-xs flex justify-between">
                        <p>{searchName(recap.type, types)}</p>
                        <p>{dateReadable(recap.date)}</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => handleDialog(recap.id)}
                          className="px-1 ml-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 128 512"
                            className="w-1"
                          >
                            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                          </svg>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[310px] rounded">
                        <DialogHeader>
                          <DialogTitle>Edit Data</DialogTitle>
                          <DialogDescription>
                            What data do you want to edit.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={amount ?? ""}
                                onChange={e =>
                                  setAmount(Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="type">Type</Label>
                              <Select
                                value={selectedType?.toString() || ""}
                                onValueChange={handleSelectType}
                              >
                                <SelectTrigger id="type">
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {types.map(type => (
                                    <SelectItem
                                      key={type.id}
                                      value={type.id.toString()}
                                    >
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="date">Date</Label>
                              <Popover>
                                <PopoverTrigger id="date" asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                      format(selectedDate, "dd MMMM yyyy")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div>
                            <Button
                              className="w-full"
                              onClick={() => handleUpdate(recap.id)}
                            >
                              Edit
                            </Button>
                          </div>
                          <Separator className="my-2" />
                          <div>
                            <Button
                              className="w-full bg-red-600"
                              onClick={() => handleDelete(recap.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
