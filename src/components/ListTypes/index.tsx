import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateData, deleteData } from "@/lib/api";

type Type = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  types: Type[];
};

export default function ListTypes({ types }: Props) {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>();

  const handleDialog = (id: number) => {
    const data = types.find(type => type.id === id);
    if (data) {
      setName(data.name);
      setPrice(data.price);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!name || price === undefined) return;

    const data = { name, price };

    try {
      const response = await updateData("types", id, data);
      setName("");
      setPrice(undefined);
      console.log("Data updated:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteData("types", id);
      console.log("Data deleted:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type List</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32 rounded-md border">
          <div className="p-4">
            {types.map(type => (
              <div key={type.id}>
                <div className="flex">
                  <div className="w-full">
                    <div className="flex justify-between text-xs">
                      <p>{type.name}</p>
                      <p>
                        {type.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => handleDialog(type.id)}
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
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
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
                          <Button
                            className="w-full"
                            onClick={() => handleUpdate(type.id)}
                          >
                            Edit
                          </Button>
                        </div>
                        <Separator className="my-2" />
                        <div>
                          <Button
                            className="w-full bg-red-600"
                            onClick={() => handleDelete(type.id)}
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
