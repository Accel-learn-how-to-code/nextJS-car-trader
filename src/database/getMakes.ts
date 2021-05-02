import { openDB } from "../openDB";

export async function getMakes() {
  const db = await openDB();
  const makes = await db.all(
    "select make, count(*) as count from car group by make "
  );
  return makes;
}
