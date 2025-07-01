"use client" // İstemci bileşeni olduğunu belirtmek için bu satırı ekleyebilirsiniz.

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority" // VariantProps'ı da import edebilirsiniz.

import { cn } from "@/lib/utils"

// Label'ı React.forwardRef ile sarıyoruz.
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref} // ref'i burada iletiyoruz.
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }