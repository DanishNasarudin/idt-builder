"use client";
import { sendNodemail } from "@/app/(serverActions)/sendEmail";
import { createPDF } from "@/lib/utils";
import {
  ProductItemSelectionData,
  useTriggerStore,
  useUserSelected,
} from "@/lib/zus-store";
// import { Products, useSelectStore, useTriggerStore } from "@/lib/zus-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { State } from "country-state-city";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  quoteId: string | null;
};

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  contact: z.string().regex(new RegExp(/\+60-[0-9]{7,10}/), {
    message:
      "Please enter a valid Malaysian phone number in the format: +60-123456789",
  }),
  state: z.string().min(2, { message: "State is required." }),
  reason: z.string().min(2, { message: "Reason is required." }),
  requirements: z.string(),
});

export type FormFields = z.infer<typeof schema>;

const NewForm = ({ quoteId }: Props) => {
  const quoteData = useUserSelected((state) => state.selected);

  // Initiate Form Registry
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  //Recollect Rows
  function generateRows(data: ProductItemSelectionData[]): string {
    return data
      .map(
        (item) => `
      <tr class="email__row" style="border-bottom: 1px solid gray">
        <td style="width: 70%">${item.products[0].product_name}</td>
        <td style="width: 10%">${item.products[0].dis_price}</td>
        <td style="width: 10%">${item.qty}</td>
        <td style="width: 10%">${item.sub_total}</td>
      </tr>
    `
      )
      .join("");
  }

  const fullUrl = `${window.location.protocol}//${window.location.host}/quote/${quoteId}`;

  const pdfTrigger = useTriggerStore((state) => state.trigger);
  const setTrigger = useTriggerStore((state) => state.setTrigger);
  const onPDF: SubmitHandler<FormFields> = async (data) => {
    try {
      if (!quoteData) throw new Error("Quote Data missing.");
      // console.log("pass in");
      const response = await fetch("/quoteTemplate.html");
      let template = await response.text();

      const emailHTMLRow = generateRows(quoteData.product_items);

      template = template.replace("{{quoteDate}}", String(quoteData.createdAt));
      template = template.replace("{{emailHTMLRow}}", emailHTMLRow);
      template = template.replace("{{oriPrice}}", String(quoteData.ori_total));
      template = template.replace(
        "{{discount}}",
        String(quoteData.ori_total - quoteData.grand_total)
      );
      template = template.replace(
        "{{totalPrice}}",
        String(quoteData.grand_total)
      );
      template = template.replace("{{link}}", fullUrl);
      template = template.replace("{{link}}", fullUrl);
      template = template.replace("{{name}}", data.name);
      template = template.replace("{{email}}", data.email);
      template = template.replace("{{contact}}", data.contact);
      template = template.replace("{{state}}", data.state);
      template = template.replace("{{reason}}", data.reason);
      template = template.replace("{{requirements}}", data.requirements);
      template = template.replace(
        "{{monthly}}",
        String(Math.floor(quoteData.grand_total / (1 - 0.04) / 12))
      );

      createPDF(template);
      toast.success("Downloaded PDF!");
      setTrigger(false);
    } catch (error) {
      console.log(error);
      setTrigger(false);
    }
  };

  // console.log(getValues());

  React.useEffect(() => {
    pdfTrigger && onPDF(getValues());
  }, [pdfTrigger]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (!quoteData) throw new Error("Quote Data missing.");
      const response = await fetch("/quoteTemplate.html");
      let template = await response.text();

      const emailHTMLRow = generateRows(quoteData.product_items);

      template = template.replace("{{quoteDate}}", String(quoteData.createdAt));
      template = template.replace("{{emailHTMLRow}}", emailHTMLRow);
      template = template.replace("{{oriPrice}}", String(quoteData.ori_total));
      template = template.replace(
        "{{discount}}",
        String(quoteData.ori_total - quoteData.grand_total)
      );
      template = template.replace(
        "{{totalPrice}}",
        String(quoteData.grand_total)
      );
      template = template.replace("{{link}}", fullUrl);
      template = template.replace("{{link}}", fullUrl);
      template = template.replace("{{name}}", data.name);
      template = template.replace("{{email}}", data.email);
      template = template.replace("{{contact}}", data.contact);
      template = template.replace("{{state}}", data.state);
      template = template.replace("{{reason}}", data.reason);
      template = template.replace("{{requirements}}", data.requirements);
      template = template.replace(
        "{{monthly}}",
        String(Math.floor(quoteData.grand_total / (1 - 0.04) / 12))
      );

      // console.log(template);
      await sendNodemail({ template, data });
    } catch (error) {
      setError("root", {
        message: error as string,
      });
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-1">
        <b className="text-x">Next Step</b>
        <p className="text-x">
          Enter your details and submit the quotation. We will contact you.
        </p>
        <p className="text-x">
          Or, you may copy the quotation link and send it to us through message.
        </p>
      </div>
      <form
        className="mt-8 flex w-full max-w-[500px] flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-2">
          <Input
            radius="sm"
            value={fullUrl}
            // isDisabled
            aria-label="quote_link"
            readOnly
          />
          <Button
            radius="sm"
            className="bg-accent"
            onClick={() => {
              navigator.clipboard.writeText(fullUrl);
              toast.success("Copied!");
            }}
          >
            Copy
          </Button>
        </div>
        <Input
          isInvalid={Boolean(errors.name !== undefined)}
          color={errors.name ? "danger" : "default"}
          errorMessage={errors.name && errors.name.message}
          {...register("name")}
          variant="bordered"
          aria-label="name"
          label="Name"
          isRequired
        />
        <Input
          isInvalid={Boolean(errors.email !== undefined)}
          color={errors.email ? "danger" : "default"}
          errorMessage={errors.email && errors.email.message}
          {...register("email")}
          variant="bordered"
          aria-label="email"
          label="Email"
          isRequired
        />
        <Input
          isInvalid={Boolean(errors.contact !== undefined)}
          color={errors.contact ? "danger" : "default"}
          errorMessage={errors.contact && errors.contact.message}
          {...register("contact")}
          defaultValue="+60-"
          placeholder="+60-123456789"
          variant="bordered"
          aria-label="contact"
          label="Contact"
          isRequired
        />
        <Select
          isInvalid={Boolean(errors.state !== undefined)}
          // color={errors.state ? "danger" : "default"}
          errorMessage={errors.state && errors.state.message}
          {...register("state", { required: true })}
          variant="bordered"
          aria-label="state"
          label="Which state are you from?"
          isRequired
        >
          {State.getStatesOfCountry("MY").map((option) => {
            return (
              <SelectItem key={option.name} value={option.name}>
                {option.name}
              </SelectItem>
            );
          })}
        </Select>
        <Textarea
          isInvalid={Boolean(errors.reason !== undefined)}
          color={errors.reason ? "danger" : "default"}
          errorMessage={errors.reason && errors.reason.message}
          {...register("reason", { required: true })}
          variant="bordered"
          aria-label="reason"
          label="What are you using the PC for?"
          isRequired
        />
        <Textarea
          isInvalid={Boolean(errors.requirements !== undefined)}
          color={errors.requirements ? "danger" : "default"}
          errorMessage={errors.requirements && errors.requirements.message}
          {...register("requirements")}
          variant="bordered"
          aria-label="requirements"
          label="Any other requirements you would like?"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`${isSubmitting ? "" : "bg-accent"}`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default NewForm;
