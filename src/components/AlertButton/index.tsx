import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

interface AlertButtonProps extends React.ComponentProps<typeof Button> {
  alertTitle?: string;
  alertDescription?: string;
  onCancel?: MouseEventHandler<HTMLButtonElement> | undefined;
  onAction?: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function AlertButton({
  alertDescription,
  alertTitle,
  onCancel,
  onAction,
  ...props
}: AlertButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props}>{props.children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitle ?? "Tem certeza?"}</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
