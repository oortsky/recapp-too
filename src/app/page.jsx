"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import MonthlyIncome from "@/components/MonthlyIncome";
import HistoryRecaps from "@/components/HistoryRecaps";
import ListTypes from "@/components/ListTypes";
import AddingData from "@/components/AddingData";
import { fetchData } from "@/lib/api";
import { searchName } from "@/utils/searchName";
import { searchPrice } from "@/utils/searchPrice";
import { dateReadable } from "@/utils/dateReadable";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Main() {
  const [recaps, setRecaps] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTypes, setSelectedTypes] = useState("*");
  const [filteredRecaps, setFilteredRecaps] = useState([]);
  const [groupedByType, setGroupedByType] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [previousMonthIncome, setPreviousMonthIncome] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchRecapsData = async () => {
      try {
        // Konversi selectedMonth dan selectedYear dari string menjadi number
        const month = parseInt(selectedMonth, 10);
        const year = parseInt(selectedYear, 10);

        // Periksa apakah selectedMonth dan selectedYear sudah dipilih
        if (!isNaN(month) && !isNaN(year)) {
          // Panggil fetchData dengan filter bulan dan tahun
          const recapsData = await fetchData("recaps", month, year);
          setRecaps(recapsData);
        } else {
          // Jika bulan atau tahun tidak valid, panggil fetchData tanpa filter
          const recapsData = await fetchData("recaps");
          setRecaps(recapsData);
        }
      } catch (error) {
        console.error("Error fetching recaps:", error);
      }
    };

    const fetchTypesData = async () => {
      try {
        const typesData = await fetchData("types");
        setTypes(typesData);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRecapsData(), fetchTypesData()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedYear(currentDate.getFullYear().toString());
    setSelectedMonth((currentDate.getMonth() + 1).toString());
  }, []);

  useEffect(() => {
    const filterAndGroupData = () => {
      const filteredData = filterByMonthAndYear(
        recaps,
        parseInt(selectedMonth),
        parseInt(selectedYear)
      );

      const groupedData = groupByType(filteredData);
      setGroupedByType(groupedData);

      if (selectedTypes !== "*") {
        const filteredByType = {
          [selectedTypes]: groupedData[parseInt(selectedTypes)] || []
        };
        setGroupedByType(filteredByType);
      } else {
        setGroupedByType(groupedData);
      }

      setFilteredRecaps(filteredData);
    };

    if (recaps.length > 0 && types.length > 0) {
      filterAndGroupData();
    }
  }, [selectedYear, selectedMonth, selectedTypes, recaps, types]);

  useEffect(() => {
    const selectedYearInt = parseInt(selectedYear);
    const selectedMonthInt = parseInt(selectedMonth);

    let previousMonth = selectedMonthInt - 1;
    let previousYear = selectedYearInt;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear -= 1;
    }

    const filteredPreviousMonthData = filterByMonthAndYear(
      recaps,
      previousMonth,
      previousYear
    );

    const totalPreviousMonthIncome = filteredPreviousMonthData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.income,
      0
    );

    setPreviousMonthIncome(totalPreviousMonthIncome);
  }, [selectedYear, selectedMonth, recaps]);

  function groupByType(data) {
    const grouped = {};
    data.forEach(item => {
      const type = item.type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(item);
    });
    return grouped;
  }

  function filterByMonthAndYear(data, month, year) {
    return data.filter(item => {
      const date = new Date(item.date);
      return date.getUTCMonth() === month - 1 && date.getUTCFullYear() === year;
    });
  }

  function getMonthName(monthNumber) {
    if (monthNumber < 1 || monthNumber > 12) {
      console.error("Invalid month number. It should be between 1 and 12.");
      return "";
    }

    const date = new Date(Date.UTC(2000, monthNumber - 1, 1));
    return date.toLocaleString("id-ID", { month: "long" });
  }

  const handleSelectTypes = value => {
    setSelectedTypes(value);
  };

  const handleSelectYear = value => {
    setSelectedYear(value);
  };

  const handleSelectMonth = value => {
    setSelectedMonth(value);
  };

  const captureAllTables = () => {
    setIsDownloading(true);

    try {
      const tables = document.querySelectorAll(".my-table");

      tables.forEach((tableElement, index) => {
        html2canvas(tableElement)
          .then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = imgData;
            link.download = `table-capture-${index + 1}.png`;

            link.click();
          })
          .catch(error => {
            console.error("Error capturing table:", error);
          });
      });
    } catch (error) {
      console.error("Error capturing tables:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getTotalIncomeCurrentMonth = () => {
    // Assuming this function is meant to calculate the total income for the current month
    return filteredRecaps.reduce(
      (accumulator, currentValue) => accumulator + currentValue.income,
      0
    );
  };

  const formatDate = inputDate => {
    const date = new Date(inputDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {isLoading ? (
        <main className="w-full h-[100dvh] flex justify-center items-center text-center">
          <p>Loading...</p>
        </main>
      ) : (
        <>
          <main className="p-3.5 pb-14">
            <h1 className="text-3xl font-bold tracking-wider mb-3">
              Recapp{" "}
              <span className="text-sm font-light tracking-tighter">
                v2.0.0
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <MonthlyIncome
                data={filteredRecaps}
                previousIncome={previousMonthIncome}
              />
              <HistoryRecaps recaps={recaps} types={types} />
              <ListTypes types={types} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recap Data Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTypes} onValueChange={handleSelectTypes}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-full flex gap-3 my-3">
                  <div className="w-1/2">
                    <Select
                      value={selectedYear}
                      onValueChange={handleSelectYear}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(
                            recaps
                              .map(data => new Date(data.date).getFullYear())
                              .sort((a, b) => a - b)
                          )
                        ).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2">
                    <Select
                      value={selectedMonth}
                      onValueChange={handleSelectMonth}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Months" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(
                            recaps
                              .map(data => new Date(data.date).getMonth() + 1)
                              .sort((a, b) => a - b)
                          )
                        ).map(month => (
                          <SelectItem key={month} value={month.toString()}>
                            {getMonthName(month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedTypes !== "*" &&
                  groupedByType[parseInt(selectedTypes)]?.length === 0 && (
                    <p className="mt-5 text-center tracking-wider">
                      Data tidak ditemukan
                    </p>
                  )}
                <div className="my-table">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Object.keys(groupedByType).map(type => {
                      const typeId = parseInt(type);
                      if (selectedTypes === "*" || selectedTypes === type) {
                        const filteredData = groupedByType[typeId];
                        if (filteredData?.length > 0) {
                          return (
                            <Table key={type} className="overflow-hidden">
                              <TableHeader>
                                <TableRow>
                                  <TableHead
                                    colSpan={3}
                                    className="text-center font-semibold tracking-wider bg-neutral-900 text-white"
                                  >
                                    {searchName(typeId, types)}
                                  </TableHead>
                                </TableRow>
                                <TableRow>
                                  <TableHead>Jumlah</TableHead>
                                  <TableHead>Tanggal</TableHead>
                                  <TableHead>Pendapatan</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredData
                                  .sort(
                                    (a, b) =>
                                      new Date(a.date).getTime() -
                                      new Date(b.date).getTime()
                                  )
                                  .map(item => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        {item.amount}
                                        <span className="text-xs"> pcs</span>
                                      </TableCell>
                                      <TableCell>
                                        {formatDate(item.date)}
                                        {/* Date Format Must Be 14/09/2024 */}
                                      </TableCell>
                                      <TableCell>
                                        {item.income.toLocaleString("id-ID", {
                                          style: "currency",
                                          currency: "IDR",
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0
                                        })}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell>Subtotal</TableCell>
                                  <TableCell>
                                    {filteredData.reduce(
                                      (total, item) => total + item.amount,
                                      0
                                    )}
                                    <span className="text-xs"> pcs</span> ×{" "}
                                    {searchPrice(typeId, types)}
                                  </TableCell>
                                  {/* Must Be Subtotal 1000 pcs × Rp 20 | Rp 20.000 */}
                                  <TableCell>
                                    {filteredData
                                      .map(item => item.income)
                                      .reduce(
                                        (accumulator, currentValue) =>
                                          accumulator + currentValue,
                                        0
                                      )
                                      .toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                      })}
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          colSpan={3}
                          className="w-full text-center font-semibold tracking-wider bg-neutral-900 text-white"
                        >
                          Total Pendapatan:{" "}
                          {getTotalIncomeCurrentMonth().toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }
                          )}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
                <Button
                  className="w-full my-3"
                  onClick={captureAllTables}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Loading..." : "Download Table"}
                </Button>
              </CardContent>
            </Card>
          </main>
          <AddingData types={types} />
        </>
      )}
    </>
  );
}
