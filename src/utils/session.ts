import { redirect } from "next/navigation";
import { type Session } from "next-auth";

export class SessionUtils {
  public static checkSession(session: Session | null) {
    if (!session) {
      redirect("/login");
    }
  }
}
