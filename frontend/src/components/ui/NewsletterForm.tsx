"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrate with API
  }

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <Input
        type="email"
        placeholder="Tu correo electronico"
        className="h-10 flex-1 bg-white"
        required
      />
      <Button
        type="submit"
        className="h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
      >
        Suscribirme
      </Button>
    </form>
  );
}
