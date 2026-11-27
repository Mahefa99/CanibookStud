"use client";
import { useState, type ReactNode } from "react";
import { useFormState } from "react-dom";
import { manageFemale } from "./actions";
import { SubmitButton } from "@/src/features/auth/components/submit-button";

export function FemaleForm({action,label,children}:{action:string;label:string;children?:ReactNode}) {
  const [message,submit]=useFormState(manageFemale,"");
  return <form action={submit} className="space-y-3"><input type="hidden" name="action" value={action}/>{children}
    <SubmitButton label={label}/><p role="status">{message}</p></form>;
}

export function PhotoField() {
  const [pixels,setPixels]=useState("");
  const [error,setError]=useState("");
  return <label className="field-label">Profile photo
    <input type="file" accept="image/jpeg,image/png,image/webp" required onChange={async e=>{
      const input=e.currentTarget;
      const file=input.files?.[0];
      setPixels(""); setError("");
      if(!file) return;
      try {
        const image=await createImageBitmap(file);
        const canvas=document.createElement("canvas");
        canvas.width=320; canvas.height=240;
        const ctx=canvas.getContext("2d");
        if(!ctx) throw Error();
        const scale=Math.max(320/image.width,240/image.height);
        ctx.drawImage(image,(320-image.width*scale)/2,(240-image.height*scale)/2,image.width*scale,image.height*scale);
        image.close();
        const rgba=ctx.getImageData(0,0,320,240).data;
        let rgb="";
        for(let i=0;i<rgba.length;i+=4) rgb+=String.fromCharCode(rgba[i]!,rgba[i+1]!,rgba[i+2]!);
        if(input.files?.[0]===file) setPixels(btoa(rgb));
      } catch { setError("Choose a readable JPEG, PNG or WebP photo."); }
    }}/><input type="hidden" name="photo_rgb" value={pixels}/><span role="status">{error || (pixels?"Photo ready":"")}</span></label>;
}
