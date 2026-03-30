import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { events } from "../db/schema.js";

export const getAllEvents = async (_: Request, res: Response) => {
  try {
    const allEvents = await db.select().from(events);
    res.status(200).json({
      success: true,
      data: allEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const getEventById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);

    // Not found event
    if (!event) {
      res.status(404).json({
        success: false,
        error: "Event not found",
      });
      return;
    }

    // Found event
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};