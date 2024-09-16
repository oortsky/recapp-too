"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { searchIncome } from "@/utils/searchIncome";
import { createAPI } from "@/lib/api";

type Type = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  types: Type[];
};

export default function AddingData({ types }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<number | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>();

  const handleSelectType = (value: string) => {
    setSelectedType(Number(value));
  };

  const handleSubmitRecap = async () => {
    if (!selectedDate || selectedType === undefined || amount === undefined)
      return;

    const adjustedDate = new Date(selectedDate);
    adjustedDate.setHours(12, 0, 0, 0);

    const data = {
      amount: amount,
      type: selectedType,
      date: adjustedDate.toISOString().split("T")[0],
      income: searchIncome(selectedType, amount, types)
    };

    try {
      const response = await createAPI("recaps", data);
      setAmount(undefined);
      setSelectedType(undefined);
      setSelectedDate(undefined);
      console.log("Data created:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleSubmitType = async () => {
    if (!name || price === undefined) return;

    const data = {
      name,
      price: price
    };

    try {
      const response = await createAPI("types", data);
      setName("");
      setPrice(undefined);
      console.log("Data created:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-10 right-1/2 translate-x-1/2">
          <span className="relative flex h-12 w-12">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <Button className="relative inline-flex rounded-full h-12 w-12 bg-sky-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 448 512"
                stroke="currentColor"
                fill="currentColor"
              >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
              </svg>
            </Button>
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[310px] rounded">
        <DialogHeader>
          <DialogTitle>Adding Data</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="recap" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recap">Recap</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
          </TabsList>
          <TabsContent value="recap">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-lg font-semibold">Recap</h1>
                <p className="text-sm">
                  Make new recap. Click add when you're done.
                </p>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount !== undefined ? amount : ""}
                    onChange={e => setAmount(Number(e.target.value))}
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
                        <SelectItem key={type.id} value={type.id.toString()}>
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
                        variant={"outline"}
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
                <Button onClick={handleSubmitRecap}>Add</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="type">
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-lg font-semibold">Type</div>
                <div className="text-sm">
                  Add new type. Click add when you're done.
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price !== undefined ? price : ""}
                    onChange={e => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Button onClick={handleSubmitType}>Add</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
