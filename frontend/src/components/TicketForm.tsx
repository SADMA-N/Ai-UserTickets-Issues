import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { TicketFormSchema, type TicketFormValues } from "../schemas/ticket";
import { submitTicket } from "../lib/api";
import { getOrCreateCustomerId } from "../lib/customerId";

export function TicketForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(TicketFormSchema),
    defaultValues: { subject: "", body: "", email: "" },
  });

  const onSubmit = async (values: TicketFormValues) => {
    setServerError(null);
    try {
      const customer = { id: getOrCreateCustomerId(), email: values.email };
      const res = await submitTicket({
        subject: values.subject,
        body: values.body,
        customer,
      });
      navigate(`/tasks/${res.task_id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Submit failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl mx-auto bg-slate-900/60 border border-slate-700 rounded-xl p-6 space-y-5 shadow-xl"
    >
      <h1 className="text-2xl font-semibold text-slate-100">
        Submit a Support Ticket
      </h1>
      <p className="text-sm text-slate-400">
        Describe your issue. Our AI assistant will analyze it and prepare a
        response.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Subject
        </label>
        <input
          {...register("subject")}
          maxLength={500}
          placeholder="Login broken"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Description
        </label>
        <textarea
          {...register("body")}
          rows={5}
          maxLength={10000}
          placeholder="Can't log in. Tried resetting password..."
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.body && (
          <p className="mt-1 text-xs text-red-400">{errors.body.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Your email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="user@example.com"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 transition"
      >
        {isSubmitting ? "Submitting…" : "Submit ticket"}
      </button>
    </form>
  );
}
