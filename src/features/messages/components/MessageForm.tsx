import { Button, Field } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useMessagesStore } from "@/store/messagesStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Send } from "lucide-react";
import { Controller, useForm, type Message } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { chatKeys } from "../messages.keys";

const schemaMessage = z.object({
  message: z.string().trim().min(1, "Ingrese al menos un caracter"),
});

type schemaMessageType = z.infer<typeof schemaMessage>;

export function MessageForm({ chatID }: { chatID: string }) {
  const { control, handleSubmit, reset } = useForm<schemaMessageType>({
    resolver: zodResolver(schemaMessage),
    defaultValues: {
      message: "",
    },
  });

  const { idProfileChat } = useMessagesStore();

  const { profile } = useAuthStore();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: schemaMessageType) => {
      const { data: response, error } = await supabase.rpc(
        "send_private_message",
        {
          target_user_id: idProfileChat,
          message_content: data.message,
        },
      );

      if (error) throw error;
      return response;
    },
    onSuccess: () => {
      reset();
    },
    onMutate: async (mensaje) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.chat(chatID) });

      const cacheAnterior = queryClient.getQueryData(chatKeys.chat(chatID));

      queryClient.setQueryData(chatKeys.chat(chatID), (cache: Message[]) => {
        if (!cache) return cache;
        const mensajeOptimista = {
          id: crypto.randomUUID(),
          content: mensaje.message,
          user_id: profile?.id,
          chat_id: chatID,
          created_at: dayjs(),
        };
        return [...cache, mensajeOptimista];
      });

      return { cacheAnterior };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(chatKeys.chat(chatID), context?.cacheAnterior);
      toast.error(error.message);
    },
    onSettled: (data) => {
      if (data?.is_new) {
        queryClient.invalidateQueries({ queryKey: chatKeys.all });
      }
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          mutate(data);
        })}
        className="border-t py-5 px-3 w-full break-all grid grid-cols-[5fr_1fr] gap-3"
      >
        <Controller
          control={control}
          name="message"
          render={({ field, fieldState }) => (
            <Field>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                className="field-sizing-content min-h-15 max-h-30 no-scrollbar"
                id="mensaje"
                placeholder="Tu mensaje..."
              />
            </Field>
          )}
        />
        <div className="h-15 max-h-15 flex items-center grow justify-end self-end">
          <Button disabled={isPending} variant={"default"}>
            <Send />
            {isPending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </>
  );
}
