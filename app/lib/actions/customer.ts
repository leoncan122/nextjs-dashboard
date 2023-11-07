"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


const CustomerSchema = z.object({
    id: z.string(),
    firstname: z.string({
      invalid_type_error: 'First name can not be empty'
    }),
    lastname: z.string({
      invalid_type_error: 'Lastname can not be empty'
    }),
    phone: z.coerce
      .number()
      .gt(0, { message: "Please enter an amount greater than 0." }),
    email: z.string({
      invalid_type_error: 'Email can not be empty'
    }),
    // image_url: z.string(),
    // date: z.string(),

  });
  
  const CreateCustomer = CustomerSchema.omit({ id: true, date: true });
  const UpdateCustomer = CustomerSchema.omit({ date: true, id: true });
  


export async function createCustomer( prevState: any,formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      phone: formData.get('phone'),
    //   image_url: formData.get("image_url"),
    });
    // console.log(formData)
    // const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to Create Invoice.",
        };
      }
      const { firstname, lastname, email, phone } = validatedFields.data;
  
    try {
      await sql`
        INSERT INTO customers (name, email, phone, image_url ) VALUES (${firstname+' '+lastname}, ${email}, ${phone}, '/customers/hector-simpson.png');
      `;
    } catch (error) {
        console.log(error)
      return {
        message: "Database Error: Failed to Update Invoice.",
      };
    }
  
    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
  }

export async function updateCustomer(id: string, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update customer.",
    };
  }
  const {firstname, lastname, email, phone} = validatedFields.data
  try {
    await sql`
      UPDATE customers
      SET name = ${firstname+' '+lastname}, email = ${email}, phone = ${phone}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
export async function deleteCustomer(id: string) {

  // Unreachable code block
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath("/dashboard/customers");
    return { message: "Deleted customer" };
  } catch (error) {
    return { message: "Database Error: Failed to Delete customer" };
  }
}
  