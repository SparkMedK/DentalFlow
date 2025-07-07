
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Loader2, DollarSign, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { format, isToday, isSameMonth, isSameYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DashboardPage() {
  const { patients, consultations, isLoading } = useAppContext();
  const [month, setMonth] = React.useState<Date>(new Date());
  const [year, setYear] = React.useState<Date>(new Date());
  const [monthPopoverOpen, setMonthPopoverOpen] = React.useState(false);
  const [yearPopoverOpen, setYearPopoverOpen] = React.useState(false);


  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalPatients = patients.length;
  const totalAppointments = consultations.length;
  const pendingAppointments = consultations.filter(c => c.status === 'Scheduled').length;

  const completedConsultations = consultations.filter(c => c.status === 'Completed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const revenueToday = completedConsultations
    .filter(c => isToday(new Date(c.date)))
    .reduce((acc, c) => acc + c.price, 0);

  const revenueThisMonth = completedConsultations
    .filter(c => isSameMonth(new Date(c.date), month))
    .reduce((acc, c) => acc + c.price, 0);

  const revenueThisYear = completedConsultations
    .filter(c => isSameYear(new Date(c.date), year))
    .reduce((acc, c) => acc + c.price, 0);
  
  const allTimeRevenue = completedConsultations
    .reduce((acc, c) => acc + c.price, 0);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              All patients in the directory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled consultations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
             <p className="text-xs text-muted-foreground">
              Appointments not yet completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-2xl font-bold tracking-tight">Revenue Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Today's Revenue
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenueToday)}</div>
                    <p className="text-xs text-muted-foreground">
                    From completed consultations today
                    </p>
                </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue for {format(month, 'MMMM yyyy')}
                </CardTitle>
                <Popover open={monthPopoverOpen} onOpenChange={setMonthPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="sr-only">Open calendar</span>
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={month}
                      onSelect={(date) => {
                        if (date) setMonth(date);
                        setMonthPopoverOpen(false);
                      }}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={new Date().getFullYear() + 5}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenueThisMonth)}</div>
                <p className="text-xs text-muted-foreground">
                  Revenue from selected month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue for {format(year, 'yyyy')}
                </CardTitle>
                <Popover open={yearPopoverOpen} onOpenChange={setYearPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="sr-only">Open calendar</span>
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={year}
                      onSelect={(date) => {
                        if (date) setYear(date);
                        setYearPopoverOpen(false);
                      }}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={new Date().getFullYear() + 5}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenueThisYear)}</div>
                <p className="text-xs text-muted-foreground">
                  Revenue from selected year
                </p>
              </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">All-Time Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(allTimeRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                        Total from all completed consultations
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Welcome to DentalFlow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your central hub for managing patients and consultations. Use the navigation on the left to get started. You can view your patient directory, schedule new consultations, and even generate AI-powered summaries of your appointments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
