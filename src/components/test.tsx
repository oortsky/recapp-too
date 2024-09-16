<Dialog>
  <DialogTrigger asChild>
    <div className="fixed bottom-16 right-1/2 translate-x-1/2">
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
      <DialogDescription>Select what data you want to add.</DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Recap</h1>
        <p className="text-sm">Make new recap. Click add when you're done.</p>
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="type">Type</Label>
          <Select
            value={selectedType}
            onValueChange={handleSelectType}
            id="type"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>
          <Popover id="date">
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal")}
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
        <Button>Add</Button>
      </div>
    </div>
  </DialogContent>
</Dialog>;

onClick={() => alert(`clicked! ${recap.id}`)}