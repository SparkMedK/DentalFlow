"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Stethoscope,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/app-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";

export function Sidebar() {
  const pathname = usePathname();
  const { patients, consultations } = useAppContext();
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleFirebaseBackup = async () => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Firebase Not Configured",
        description: "Please add your Firebase configuration to the .env file.",
      });
      return;
    }
    
    setIsBackingUp(true);
    toast({ title: "Starting Backup", description: "Your data is being backed up to Firebase..." });

    try {
      const batch = writeBatch(db);
      const backupTimestamp = new Date().toISOString();
      const backupDocRef = doc(db, "backups", backupTimestamp);
      
      const backupMetadata = {
        createdAt: backupTimestamp,
        patientCount: patients.length,
        consultationCount: consultations.length,
      };
      batch.set(backupDocRef, backupMetadata);

      patients.forEach(patient => {
        const patientRef = doc(db, "backups", backupTimestamp, "patients", patient.id);
        batch.set(patientRef, patient);
      });

      consultations.forEach(consultation => {
        const consultationRef = doc(db, "backups", backupTimestamp, "consultations", consultation.id);
        batch.set(consultationRef, consultation);
      });

      await batch.commit();

      toast({ title: "Backup Successful", description: "Your data has been successfully backed up." });
    } catch (error) {
      console.error("Firebase backup failed:", error);
      toast({
        variant: "destructive",
        title: "Backup Failed",
        description: "There was an error backing up your data. Please check your Firebase configuration and console for details.",
      });
    } finally {
      setIsBackingUp(false);
    }
  };


  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/patients", icon: Users, label: "Patients" },
    { href: "/consultations", icon: Stethoscope, label: "Consultations" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">DentalFlow</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleFirebaseBackup} 
                disabled={isBackingUp || !db} 
                className="h-9 w-9 md:h-8 md:w-8 text-muted-foreground hover:text-foreground"
              >
                  {isBackingUp ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                  <span className="sr-only">Backup to Firebase</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Backup to Firebase</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
