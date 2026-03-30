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

export interface UpdateRegisteredCountRequestBody {
  registeredCount: number;
}

const validateUpdateRegisteredCountRequestBody = (body: UpdateRegisteredCountRequestBody): string | null => {
  const { registeredCount } = body;

  if (registeredCount === undefined) {
    return "Registered count is required";
  }

  if (registeredCount < 0) {
    return "Registered count cannot be negative";
  }

  if (isNaN(registeredCount)) {
    return "Registered count must be a number";
  }

  return null;
}

export const updateRegisteredCount = async (req: Request<{ id: string }, {}, UpdateRegisteredCountRequestBody>, res: Response) => {
  const { id } = req.params;
  const { registeredCount } = req.body;

  // Validate request body
  const validationError = validateUpdateRegisteredCountRequestBody(req.body);
  if (validationError) {
    res.status(400).json({
      success: false,
      error: validationError,
    });
    return;
  }

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

    if (event.maxParticipants && (registeredCount > event.maxParticipants)) {
      res.status(400).json({
        success: false,
        error: "Registered count cannot exceed maximum participants",
      });
      return;
    }

    // Update registered count
    const [updatedEvent] = await db.update(events)
      .set({ registeredCount })
      .where(eq(events.id, id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating registered count:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};