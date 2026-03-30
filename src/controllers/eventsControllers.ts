import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { events } from "../db/schema.js";

export interface CreateEventRequestBody {
  name: string;
  description?: string;
  date: string; // ISO format
  location: string;
  maxParticipants?: number;
}

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

const validateCreateEventRequestBody = (body: CreateEventRequestBody): string | null => {
  const { name, date, location, maxParticipants } = body;
  const dateObj = new Date(date);

  if (!name) {
    return "Event name is required";
  }

  if (!date) {
    return "Event date is required";
  }

  if (!location) {
    return "Event location is required";
  }

  if (isNaN(dateObj.getTime())) {
    return "Invalid date format. Please use ISO format.";
  }

  if (dateObj < new Date()) {
    return "Event date cannot be in the past";
  }

  if (maxParticipants !== undefined && maxParticipants < 0) {
    return "Maximum participants cannot be negative";
  }

  return null;
};

export const createEvent = async (req: Request<{}, {}, CreateEventRequestBody>, res: Response) => {
  const { name, description, date, location, maxParticipants } = req.body;

  // Validate request body
  const validationError = validateCreateEventRequestBody(req.body);
  if (validationError) {
    res.status(400).json({
      success: false,
      error: validationError,
    });
    return;
  }

  try {
    const [newEvent] = await db.insert(events).values({
      name,
      description,
      date: new Date(date), // Convert string to Date object
      location,
      maxParticipants,
    }).returning();

    res.status(201).json({
      success: true,
      data: newEvent,
    });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}