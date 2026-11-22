import { loadEnvConfig } from "@next/env";
import { createAdminClient } from "../src/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const seedSuffix = "@seed.chargemate.test";
const db = createAdminClient() as unknown as SupabaseClient;

type SeedUser = { name: string; phone: string; role: "host" | "rider" };
const hosts: SeedUser[] = [
  { name: "Ramesh Verma", phone: "+919876543210", role: "host" },
  { name: "Priya Sharma", phone: "+919876543211", role: "host" },
  { name: "Suresh Kumar", phone: "+919876543212", role: "host" },
  { name: "Ananya Iyer", phone: "+919876543213", role: "host" },
  { name: "Vikram Patil", phone: "+919876543214", role: "host" },
  { name: "Meera Nair", phone: "+919876543215", role: "host" },
  { name: "Arjun Mehta", phone: "+919876543216", role: "host" },
  { name: "Sneha Desai", phone: "+919876543217", role: "host" },
  { name: "Ravi Krishnan", phone: "+919876543218", role: "host" },
  { name: "Lakshmi Reddy", phone: "+919876543219", role: "host" },
  { name: "Deepak Joshi", phone: "+919876543220", role: "host" },
  { name: "Preethi Gowda", phone: "+919876543221", role: "host" },
  { name: "Sanjay Kulkarni", phone: "+919876543222", role: "host" },
  { name: "Nandini Rao", phone: "+919876543223", role: "host" },
  { name: "Kartik Singh", phone: "+919876543224", role: "host" },
  { name: "Divya Menon", phone: "+919876543225", role: "host" },
  { name: "Mohit Kapoor", phone: "+919876543226", role: "host" },
  { name: "Yasmin Shaikh", phone: "+919876543227", role: "host" },
  { name: "Gopal Nambiar", phone: "+919876543228", role: "host" },
  { name: "Rekha Pillai", phone: "+919876543229", role: "host" },
];
const riders: SeedUser[] = [
  { name: "Pooja Hegde", phone: "+919823456789", role: "rider" },
  { name: "Kavya Reddy", phone: "+919823456780", role: "rider" },
  { name: "Deepak Malhotra", phone: "+919823456781", role: "rider" },
  { name: "Sarita Ghosh", phone: "+919823456782", role: "rider" },
  { name: "Ritika Pandey", phone: "+919823456783", role: "rider" },
];

const spotSpecs = [
  { title: "Ramesh's Covered Driveway", locality: "Indiranagar", city: "Bengaluru", address: "12, 12th Cross, HAL 2nd Stage, Indiranagar", lat: 12.9784, lng: 77.6408, power: 7.2, connector: "Type2", price: 12, online: true, rules: "No parking after 22:00. Ring bell on arrival.", photo: "photo-1593941707882-a56f1f27b0b8" },
  { title: "Priya's EV Point", locality: "Indiranagar", city: "Bengaluru", address: "47, CMH Road, Indiranagar 1st Stage", lat: 12.9721, lng: 77.6387, power: 3.3, connector: "16A_socket", price: 10, online: true, rules: "Please charge your vehicle only. No overnight parking.", photo: "photo-1558618666-fcd25c85cd64" },
  { title: "Suresh's Shaded Driveway", locality: "Koramangala", city: "Bengaluru", address: "14B, 4th Main Rd, Koramangala 4th Block", lat: 12.9352, lng: 77.6245, power: 7.2, connector: "CCS2", price: 14, online: true, rules: "Gate code shared after booking. Covered parking available.", photo: "photo-1593941707882-a56f1f27b0b8" },
  { title: "Ananya Apartments Charger", locality: "Koramangala", city: "Bengaluru", address: "22, 80 Feet Rd, Koramangala 6th Block", lat: 12.9319, lng: 77.6198, power: 3.3, connector: "3pin", price: 10, online: false, rules: null, photo: "" },
  { title: "Vikram's Home Charger", locality: "Kothrud", city: "Pune", address: "Plot 8, Bhosale Nagar, Kothrud", lat: 18.5048, lng: 73.8219, power: 7.2, connector: "Type2", price: 13, online: true, rules: "Parking spot C-4 reserved. Vehicle must stay during charging.", photo: "photo-1593941707882-a56f1f27b0b8" },
  { title: "Meera's Green Bay Charger", locality: "Baner", city: "Pune", address: "31, Baner Pashan Link Road, Baner", lat: 18.5590, lng: 73.7892, power: 7.2, connector: "CCS2", price: 16, online: true, rules: "Only booked EVs. CCTV monitored. No ICE vehicles.", photo: "photo-1558618666-fcd25c85cd64" },
];

const additionalHostNames = hosts.slice(6).map((host) => host.name.split(" ")[0]);
const localities = ["Indiranagar", "Koramangala", "Kothrud", "Baner"] as const;
const bengaluruBases = [
  { lat: 12.9784, lng: 77.6408 }, { lat: 12.9352, lng: 77.6245 },
];
const puneBases = [
  { lat: 18.5048, lng: 73.8219 }, { lat: 18.5590, lng: 73.7892 },
];
for (let index = 6; index < hosts.length; index += 1) {
  const locality = localities[(index - 6) % localities.length];
  const bengaluru = locality === "Indiranagar" || locality === "Koramangala";
  const base = bengaluru ? bengaluruBases[locality === "Indiranagar" ? 0 : 1] : puneBases[locality === "Kothrud" ? 0 : 1];
  const offset = Math.floor((index - 6) / 4) * 0.0014;
  const city = bengaluru ? "Bengaluru" : "Pune";
  const name = additionalHostNames[index - 6];
  const connector = ["CCS2", "Type2", "16A_socket", "3pin"][(index - 6) % 4];
  spotSpecs.push({
    title: `${name}'s ${locality} Charger`, locality, city,
    address: `${20 + index}, ${locality} Main Road, ${city}`,
    lat: base.lat + offset, lng: base.lng + offset,
    power: index % 2 === 0 ? 7.2 : 3.3, connector,
    price: 10 + ((index - 6) % 7), online: true,
    rules: "Park only in the marked EV bay; keep the access lane clear.",
    photo: "photo-1593941707882-a56f1f27b0b8",
  });
}

const vehicles = [
  { rider: 0, type: "car", make: "Tata", model: "Tiago EV", connector: "CCS2", battery: 24 },
  { rider: 0, type: "scooter", make: "Ather", model: "450X Gen 3", connector: "3pin", battery: 2.9 },
  { rider: 1, type: "car", make: "Tata", model: "Nexon EV", connector: "CCS2", battery: 40.5 },
  { rider: 2, type: "scooter", make: "Ola", model: "S1 Pro", connector: "3pin", battery: 4 },
  { rider: 3, type: "car", make: "Tata", model: "Tiago EV", connector: "CCS2", battery: 24 },
  { rider: 4, type: "car", make: "MG", model: "Windsor EV", connector: "CCS2", battery: 38 },
];

const demoReviews = [
  { rating: 5, comment: "Excellent spot! Gate code worked perfectly, charging was fast and the driveway is nicely shaded. Will come back!", reply: "Thank you Kavya! Your EV is welcome anytime 🙏", rider: 1, host: 0, date: "2026-10-24T13:00:00.000Z", started: "2026-10-24T10:00:00.000Z", ended: "2026-10-24T12:30:00.000Z", created: "2026-10-24T09:55:00.000Z", kwh: 18, amount: 216 },
  { rating: 5, comment: "Suresh was very welcoming. CCS2 charger works great, gave full 7.2 kW. Perfect for a quick charge before the evening.", reply: null, rider: 0, host: 2, date: "2026-10-21T16:00:00.000Z", started: "2026-10-21T14:05:00.000Z", ended: "2026-10-21T15:38:00.000Z", created: "2026-10-21T14:00:00.000Z", kwh: 8.2, amount: 73.8 },
  { rating: 4, comment: "Good experience overall. Spot was a little hard to find the first time but Vikram guided me on WhatsApp. Charger reliable.", reply: "Sorry about the directions — I've added a landmark note to the listing now!", rider: 0, host: 4, date: "2026-10-18T13:00:00.000Z", started: "2026-10-18T09:30:00.000Z", ended: "2026-10-18T11:55:00.000Z", created: "2026-10-18T09:25:00.000Z", kwh: 13.6, amount: 122.4 },
  { rating: 5, comment: "Ramesh bhai is the best! Very punctual, charger always online. Been using his spot for 3 months now.", reply: "Always happy to host you Deepak! 😊", rider: 2, host: 0, date: "2026-10-24T10:30:00.000Z", started: "2026-10-24T06:00:00.000Z", ended: "2026-10-24T09:00:00.000Z", created: "2026-10-24T05:55:00.000Z", kwh: 13, amount: 156 },
  { rating: 5, comment: "Great host. Spot exactly as described. Type 2 cable is long enough for my car easily.", reply: null, rider: 3, host: 0, date: "2026-10-20T09:00:00.000Z", started: "2026-10-20T07:00:00.000Z", ended: "2026-10-20T08:35:00.000Z", created: "2026-10-20T06:55:00.000Z", kwh: 9.5, amount: 114 },
];
const dates = [
  "2026-10-24", "2026-10-21", "2026-10-18", "2026-10-24", "2026-10-20",
  "2026-10-14", "2026-10-10", "2026-10-05", "2026-10-02", "2026-09-25",
  "2026-09-20", "2026-09-18", "2026-09-15", "2026-09-12", "2026-09-08",
  "2026-09-05", "2026-09-01", "2026-08-30", "2026-08-28", "2026-08-25",
  "2026-08-22", "2026-08-20", "2026-08-18", "2026-08-15", "2026-08-12",
  "2026-08-10", "2026-08-08", "2026-08-05", "2026-08-03", "2026-08-01",
];
const comments = [
  "Easy to find and the charger worked reliably. Great host.",
  "Convenient location and a smooth charging session. Would book again.",
  "Clean, secure parking and clear instructions from the host.",
  "Reliable charging and a very helpful host. Recommended.",
];

function assertNoError(result: { error: { message: string } | null }, operation: string) {
  if (result.error) throw new Error(`${operation} failed: ${result.error.message}`);
}

function emailFor(user: SeedUser) {
  return `${user.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}${seedSuffix}`;
}

async function listSeedUsers() {
  const found: { id: string; email?: string | null }[] = [];
  for (let page = 1; ; page += 1) {
    const result = await db.auth.admin.listUsers({ page, perPage: 1000 });
    assertNoError(result, "Listing auth users");
    const users: { id: string; email?: string | null }[] = result.data.users;
    found.push(...users.filter((user) => user.email?.toLowerCase().endsWith(seedSuffix)).map((user) => ({ id: user.id, email: user.email })));
    if (users.length < 1000) return found;
  }
}

async function removeSeedRows(userIds: string[]) {
  if (userIds.length === 0) return;

  const spotResult = await db.from("charging_spots").select("id").in("host_id", userIds);
  assertNoError(spotResult, "Finding existing seed spots");
  const vehicleResult = await db.from("vehicles").select("id").in("owner_id", userIds);
  assertNoError(vehicleResult, "Finding existing seed vehicles");
  const spotIds = (spotResult.data ?? []).map((row: { id: string }) => row.id);
  const vehicleIds = (vehicleResult.data ?? []).map((row: { id: string }) => row.id);

  const bookingIds = new Set<string>();
  const bookingQueries = [
    db.from("bookings").select("id").in("rider_id", userIds),
    ...(spotIds.length ? [db.from("bookings").select("id").in("spot_id", spotIds)] : []),
    ...(vehicleIds.length ? [db.from("bookings").select("id").in("vehicle_id", vehicleIds)] : []),
  ];
  for (const query of bookingQueries) {
    const result = await query;
    assertNoError(result, "Finding existing seed bookings");
    for (const row of result.data ?? []) bookingIds.add(row.id);
  }

  const reviewIds = new Set<string>();
  const reviewQueries = [
    db.from("reviews").select("id").in("rater_id", userIds),
    db.from("reviews").select("id").in("host_id", userIds),
    ...(bookingIds.size ? [db.from("reviews").select("id").in("booking_id", [...bookingIds])] : []),
  ];
  for (const query of reviewQueries) {
    const result = await query;
    assertNoError(result, "Finding existing seed reviews");
    for (const row of result.data ?? []) reviewIds.add(row.id);
  }

  if (reviewIds.size) {
    assertNoError(await db.from("reviews").delete().in("id", [...reviewIds]), "Removing existing seed reviews");
  }
  if (bookingIds.size) {
    assertNoError(await db.from("payments").delete().in("booking_id", [...bookingIds]), "Removing existing seed payments");
    assertNoError(await db.from("bookings").delete().in("id", [...bookingIds]), "Removing existing seed bookings");
  }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding.");
  }

  const priorUsers = await listSeedUsers();
  await removeSeedRows(priorUsers.map((user) => user.id));
  for (const user of priorUsers) {
    const result = await db.auth.admin.deleteUser(user.id);
    assertNoError(result, `Deleting seed user ${user.email ?? user.id}`);
  }

  const userIds = new Map<string, string>();
  for (const user of [...hosts, ...riders]) {
    const email = emailFor(user);
    const result = await db.auth.admin.createUser({
      email,
      password: `SeedOnly-${crypto.randomUUID()}`,
      email_confirm: true,
      phone: user.phone,
      phone_confirm: true,
      user_metadata: { full_name: user.name, phone: user.phone },
    });
    assertNoError(result, `Creating seed user ${email}`);
    if (!result.data.user) throw new Error(`Supabase did not return a user for ${email}`);
    userIds.set(user.name, result.data.user.id);
  }

  const profileRows = [...hosts, ...riders].map((user) => ({
    id: userIds.get(user.name)!, full_name: user.name, phone: user.phone,
    avatar_url: `https://i.pravatar.cc/150?u=${encodeURIComponent(user.name.toLowerCase().replaceAll(" ", "-"))}`,
    is_rider: user.role === "rider", is_host: user.role === "host",
    active_mode: user.role === "host" ? "host" : "charge",
  }));
  assertNoError(await db.from("profiles").upsert(profileRows), "Saving profiles");
  assertNoError(
    await db.from("wallets").update({ balance_inr: 250 }).eq("user_id", userIds.get("Pooja Hegde")!),
    "Setting Pooja's demo wallet balance",
  );

  const hostProfileRows = hosts.map((host) => ({
    user_id: userIds.get(host.name)!,
    verification_status: host.name === "Ramesh Verma" ? "verified" : "pending",
    bank_upi: `${host.name.toLowerCase().replaceAll(" ", ".")}@upi`,
  }));
  assertNoError(await db.from("host_profiles").insert(hostProfileRows), "Saving host profiles");

  const vehicleIds: string[] = [];
  for (const vehicle of vehicles) {
    const result = await db.from("vehicles").insert({
      owner_id: userIds.get(riders[vehicle.rider].name)!, type: vehicle.type,
      make: vehicle.make, model: vehicle.model, connector: vehicle.connector,
      battery_kwh: vehicle.battery,
    }).select("id").single();
    assertNoError(result, `Saving ${vehicle.model}`);
    vehicleIds.push(result.data.id);
  }

  const spotIds: string[] = [];
  for (let index = 0; index < hosts.length; index += 1) {
    const spot = spotSpecs[index];
    const result = await db.from("charging_spots").insert({
      host_id: userIds.get(hosts[index].name)!, title: spot.title,
      lat: spot.lat, lng: spot.lng, address: spot.address, locality: spot.locality,
      city: spot.city, power_kw: spot.power, connector: spot.connector,
      price_per_kwh: spot.price,
      photos: spot.photo ? [`https://images.unsplash.com/${spot.photo}?w=800`] : [],
      rules: spot.rules, available_from: "07:00", available_to: "22:00",
      is_online: spot.online,
    }).select("id").single();
    assertNoError(result, `Saving ${spot.title}`);
    spotIds.push(result.data.id);
  }

  const bookingRows = dates.map((date, index) => {
    const demo = demoReviews[index];
    const hostIndex = demo?.host ?? (index % hosts.length);
    const riderIndex = demo?.rider ?? ((index + 1) % riders.length);
    const start = demo?.started ? new Date(demo.started) : new Date(`${date}T${String(9 + (index % 9)).padStart(2, "0")}:15:00.000Z`);
    const end = demo?.ended ? new Date(demo.ended) : new Date(start.getTime() + 55 * 60_000);
    const kwh = demo?.kwh ?? Number((7 + (index % 12) * 0.8).toFixed(2));
    const amount = demo?.amount ?? Number((kwh * spotSpecs[hostIndex].price).toFixed(2));
    return {
      id: crypto.randomUUID(), spotIndex: hostIndex, riderIndex,
      date, started_at: start.toISOString(), ended_at: end.toISOString(),
      created_at: demo?.created ?? start.toISOString(),
      kwh_used: kwh, amount_inr: amount,
      start_battery_pct: 18 + ((index * 7) % 55),
      vehicle_id: vehicleIds.find((_id, vehicleIndex) => vehicles[vehicleIndex].rider === riderIndex) ?? vehicleIds[0],
    };
  });
  const insertedBookings = await db.from("bookings").insert(bookingRows.map((booking) => ({
    rider_id: userIds.get(riders[booking.riderIndex].name)!,
    spot_id: spotIds[booking.spotIndex], vehicle_id: booking.vehicle_id,
    status: "completed", start_battery_pct: booking.start_battery_pct,
    started_at: booking.started_at, ended_at: booking.ended_at,
    kwh_used: booking.kwh_used, amount_inr: booking.amount_inr,
  })).map((row, index) => ({ ...row, id: bookingRows[index].id, created_at: bookingRows[index].created_at, updated_at: bookingRows[index].ended_at })));
  assertNoError(insertedBookings, "Saving completed bookings");

  const paymentRows = bookingRows.map((booking, index) => {
    const fee = Number((booking.amount_inr * 0.05).toFixed(2));
    return {
      booking_id: booking.id, amount_inr: booking.amount_inr,
      platform_fee_inr: fee, host_payout_inr: Number((booking.amount_inr - fee).toFixed(2)),
      status: "paid", method: index % 2 === 0 ? "upi" : "wallet",
      created_at: booking.ended_at, updated_at: booking.ended_at,
    };
  });
  assertNoError(await db.from("payments").insert(paymentRows), "Saving payments");

  const reviewRows = bookingRows.map((booking, index) => {
    const demo = demoReviews[index];
    const hostIndex = booking.spotIndex;
    const riderIndex = booking.riderIndex;
    const rating = demo?.rating ?? (index % 5 === 0 ? 4 : 5);
    const reply = demo?.reply ?? (index % 3 === 0 ? "Thank you for charging with us. You're welcome back anytime!" : null);
    const createdAt = demo?.date ?? `${booking.date}T12:00:00.000Z`;
    return {
      booking_id: booking.id, rater_id: userIds.get(riders[riderIndex].name)!,
      host_id: userIds.get(hosts[hostIndex].name)!, rating,
      comment: demo?.comment ?? comments[index % comments.length],
      reply, host_reply: reply, created_at: createdAt, updated_at: createdAt,
    };
  });
  assertNoError(await db.from("reviews").insert(reviewRows), "Saving reviews");

  console.log(`Seeded ${hosts.length} hosts, ${riders.length} riders, ${spotIds.length} spots, and ${bookingRows.length} completed bookings.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error";
  console.error(message);
  process.exitCode = 1;
});
