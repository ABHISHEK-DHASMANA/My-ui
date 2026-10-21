import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 mb-6 border border-slate-200">
        <FileQuestion className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        404 - Page Not Found
      </h1>

      <p className="mt-3 text-base text-slate-600 max-w-md">
        The requested URL does not exist on the JSS Placement Intelligence Portal.
      </p>

      <div className="mt-6">
        <Button asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Company Directory</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
