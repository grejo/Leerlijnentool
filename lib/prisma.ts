// Prisma-compatible wrapper for Drizzle ORM
// This allows existing code to work without major changes

import { db, users, programs, courses, learningLines, tracks, components, contents, userPrograms, programLearningLines, programTracks } from './db';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';
import { randomUUID } from 'crypto';

function generateId(): string {
  return randomUUID().replace(/-/g, '').substring(0, 25);
}

// User model
const userModel = {
  async findUnique({ where }: { where: { id?: string; email?: string } }) {
    if (where.id) {
      return db.query.users.findFirst({ where: eq(users.id, where.id) });
    }
    if (where.email) {
      return db.query.users.findFirst({ where: eq(users.email, where.email) });
    }
    return null;
  },

  async findMany(options?: {
    select?: any;
    orderBy?: any;
    where?: any;
    include?: { programs?: { include?: { program?: boolean } } }
  }) {
    const allUsers = await db.query.users.findMany({
      orderBy: options?.orderBy?.createdAt === 'desc' ? [desc(users.createdAt)] : [asc(users.createdAt)],
      with: options?.include?.programs ? { programs: { with: { program: true } } } : undefined,
    });

    if (options?.select) {
      return allUsers.map(u => {
        const result: any = {};
        if (options.select.id) result.id = u.id;
        if (options.select.email) result.email = u.email;
        if (options.select.role) result.role = u.role;
        if (options.select.createdAt) result.createdAt = u.createdAt;
        if (options.select.programs && (u as any).programs) result.programs = (u as any).programs;
        return result;
      });
    }
    return allUsers;
  },

  async create({ data, include }: {
    data: { email: string; password: string; role: string; programs?: { create: { programId: string }[] } };
    include?: any
  }) {
    const id = generateId();
    await db.insert(users).values({
      id,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    if (data.programs?.create) {
      for (const p of data.programs.create) {
        await db.insert(userPrograms).values({
          id: generateId(),
          userId: id,
          programId: p.programId,
        });
      }
    }

    if (include?.programs) {
      return db.query.users.findFirst({
        where: eq(users.id, id),
        with: { programs: { with: { program: true } } },
      });
    }

    return db.query.users.findFirst({ where: eq(users.id, id) });
  },

  async update({ where, data, include }: {
    where: { id: string };
    data: { email?: string; password?: string; role?: string; programs?: { deleteMany?: {}; create?: { programId: string }[] } };
    include?: any;
  }) {
    const updateData: any = { updatedAt: new Date() };
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    if (data.role) updateData.role = data.role;

    await db.update(users).set(updateData).where(eq(users.id, where.id));

    if (data.programs) {
      if (data.programs.deleteMany !== undefined) {
        await db.delete(userPrograms).where(eq(userPrograms.userId, where.id));
      }
      if (data.programs.create) {
        for (const p of data.programs.create) {
          await db.insert(userPrograms).values({
            id: generateId(),
            userId: where.id,
            programId: p.programId,
          });
        }
      }
    }

    if (include?.programs) {
      return db.query.users.findFirst({
        where: eq(users.id, where.id),
        with: { programs: { with: { program: true } } },
      });
    }

    return db.query.users.findFirst({ where: eq(users.id, where.id) });
  },

  async delete({ where }: { where: { id: string } }) {
    const user = await db.query.users.findFirst({ where: eq(users.id, where.id) });
    await db.delete(users).where(eq(users.id, where.id));
    return user;
  },
};

// Program model
const programModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    const withClause: any = {};

    if (include) {
      if (include.courses) {
        withClause.courses = true;
      }
      if (include.learningLines) {
        if (include.learningLines.include?.learningLine?.include?.components) {
          withClause.learningLines = {
            with: {
              learningLine: {
                with: {
                  components: {
                    orderBy: (components: any, { asc }: any) => [asc(components.order)],
                  },
                },
              },
            },
          };
        } else if (include.learningLines.include?.learningLine) {
          withClause.learningLines = { with: { learningLine: true } };
        } else {
          withClause.learningLines = true;
        }
      }
      if (include.users) {
        withClause.users = { with: { user: true } };
      }
    }

    return db.query.programs.findFirst({
      where: eq(programs.id, where.id),
      with: Object.keys(withClause).length > 0 ? withClause : undefined,
    });
  },

  async findMany(options?: { where?: any; include?: any; orderBy?: any }) {
    let whereClause;

    if (options?.where?.users?.some?.userId) {
      // Filter by user assignment
      const userId = options.where.users.some.userId;
      const userProgramsList = await db.query.userPrograms.findMany({
        where: eq(userPrograms.userId, userId),
      });
      const programIds = userProgramsList.map(up => up.programId);

      if (programIds.length === 0) return [];

      const results = await db.query.programs.findMany({
        where: inArray(programs.id, programIds),
        orderBy: [asc(programs.name)],
        with: options?.include ? {
          courses: options.include.courses || undefined,
          learningLines: options.include.learningLines ? { with: { learningLine: true } } : undefined,
        } : undefined,
      });
      return results;
    }

    return db.query.programs.findMany({
      orderBy: [asc(programs.name)],
      with: options?.include ? {
        courses: options.include.courses || undefined,
        learningLines: options.include.learningLines ? { with: { learningLine: true } } : undefined,
      } : undefined,
    });
  },

  async create({ data }: { data: { name: string } }) {
    const id = generateId();
    await db.insert(programs).values({ id, name: data.name });
    return db.query.programs.findFirst({ where: eq(programs.id, id) });
  },

  async update({ where, data, include }: { where: { id: string }; data: { name?: string; learningLines?: any }; include?: any }) {
    if (data.name) {
      await db.update(programs).set({ name: data.name, updatedAt: new Date() }).where(eq(programs.id, where.id));
    }

    if (data.learningLines) {
      if (data.learningLines.deleteMany !== undefined) {
        await db.delete(programLearningLines).where(eq(programLearningLines.programId, where.id));
      }
      if (data.learningLines.create) {
        for (const ll of data.learningLines.create) {
          await db.insert(programLearningLines).values({
            id: generateId(),
            programId: where.id,
            learningLineId: ll.learningLineId,
          });
        }
      }
    }

    return db.query.programs.findFirst({
      where: eq(programs.id, where.id),
      with: include?.learningLines ? { learningLines: { with: { learningLine: true } } } : undefined,
    });
  },

  async delete({ where }: { where: { id: string } }) {
    const program = await db.query.programs.findFirst({ where: eq(programs.id, where.id) });
    await db.delete(programs).where(eq(programs.id, where.id));
    return program;
  },
};

// Course model
const courseModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    return db.query.courses.findFirst({
      where: eq(courses.id, where.id),
      with: include?.program ? { program: true } : undefined,
    });
  },

  async findMany(options?: { where?: any; include?: any; orderBy?: any }) {
    let whereClause;
    if (options?.where?.programId) {
      whereClause = eq(courses.programId, options.where.programId);
    }

    return db.query.courses.findMany({
      where: whereClause,
      orderBy: [asc(courses.name)],
      with: options?.include?.program ? { program: true } : undefined,
    });
  },

  async create({ data, include }: { data: { name: string; programId: string }; include?: any }) {
    const id = generateId();
    await db.insert(courses).values({ id, name: data.name, programId: data.programId });
    return db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: include?.program ? { program: true } : undefined,
    });
  },

  async update({ where, data }: { where: { id: string }; data: { name?: string; programId?: string } }) {
    const updateData: any = { updatedAt: new Date() };
    if (data.name) updateData.name = data.name;
    if (data.programId) updateData.programId = data.programId;
    await db.update(courses).set(updateData).where(eq(courses.id, where.id));
    return db.query.courses.findFirst({ where: eq(courses.id, where.id) });
  },

  async delete({ where }: { where: { id: string } }) {
    const course = await db.query.courses.findFirst({ where: eq(courses.id, where.id) });
    await db.delete(courses).where(eq(courses.id, where.id));
    return course;
  },
};

// LearningLine model
const learningLineModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    return db.query.learningLines.findFirst({
      where: eq(learningLines.id, where.id),
      with: include ? {
        components: include.components ? true : undefined,
        programs: include.programs ? { with: { program: true } } : undefined,
      } : undefined,
    });
  },

  async findMany(options?: { where?: any; include?: any; orderBy?: any }) {
    if (options?.where?.programs?.some?.programId) {
      const programId = options.where.programs.some.programId;
      const plls = await db.query.programLearningLines.findMany({
        where: eq(programLearningLines.programId, programId),
      });
      const llIds = plls.map(pll => pll.learningLineId);

      if (llIds.length === 0) return [];

      return db.query.learningLines.findMany({
        where: inArray(learningLines.id, llIds),
        orderBy: [asc(learningLines.title)],
        with: options?.include ? {
          components: options.include.components ? true : undefined,
          programs: options.include.programs ? { with: { program: true } } : undefined,
        } : undefined,
      });
    }

    return db.query.learningLines.findMany({
      orderBy: [asc(learningLines.title)],
      with: options?.include ? {
        components: options.include.components ? true : undefined,
        programs: options.include.programs ? { with: { program: true } } : undefined,
      } : undefined,
    });
  },

  async create({ data, include }: { data: { title: string; programs?: { create: { programId: string }[] } }; include?: any }) {
    const id = generateId();
    await db.insert(learningLines).values({ id, title: data.title });

    if (data.programs?.create) {
      for (const p of data.programs.create) {
        await db.insert(programLearningLines).values({
          id: generateId(),
          programId: p.programId,
          learningLineId: id,
        });
      }
    }

    return db.query.learningLines.findFirst({
      where: eq(learningLines.id, id),
      with: include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async update({ where, data, include }: { where: { id: string }; data: { title?: string; programs?: any }; include?: any }) {
    if (data.title) {
      await db.update(learningLines).set({ title: data.title, updatedAt: new Date() }).where(eq(learningLines.id, where.id));
    }

    if (data.programs) {
      if (data.programs.deleteMany !== undefined) {
        await db.delete(programLearningLines).where(eq(programLearningLines.learningLineId, where.id));
      }
      if (data.programs.create) {
        for (const p of data.programs.create) {
          await db.insert(programLearningLines).values({
            id: generateId(),
            programId: p.programId,
            learningLineId: where.id,
          });
        }
      }
    }

    return db.query.learningLines.findFirst({
      where: eq(learningLines.id, where.id),
      with: include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async delete({ where }: { where: { id: string } }) {
    const ll = await db.query.learningLines.findFirst({ where: eq(learningLines.id, where.id) });
    await db.delete(learningLines).where(eq(learningLines.id, where.id));
    return ll;
  },
};

// Track model
const trackModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    return db.query.tracks.findFirst({
      where: eq(tracks.id, where.id),
      with: include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async findMany(options?: { orderBy?: any; include?: any }) {
    return db.query.tracks.findMany({
      orderBy: [asc(tracks.order), asc(tracks.name)],
      with: options?.include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async create({ data, include }: { data: { name: string; order?: number; programs?: { create: { programId: string }[] } }; include?: any }) {
    const id = generateId();
    await db.insert(tracks).values({ id, name: data.name, order: data.order || 0 });

    if (data.programs?.create) {
      for (const p of data.programs.create) {
        await db.insert(programTracks).values({
          id: generateId(),
          programId: p.programId,
          trackId: id,
        });
      }
    }

    return db.query.tracks.findFirst({
      where: eq(tracks.id, id),
      with: include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async update({ where, data, include }: { where: { id: string }; data: { name?: string; order?: number; programs?: any }; include?: any }) {
    const updateData: any = { updatedAt: new Date() };
    if (data.name) updateData.name = data.name;
    if (data.order !== undefined) updateData.order = data.order;
    await db.update(tracks).set(updateData).where(eq(tracks.id, where.id));

    if (data.programs) {
      if (data.programs.deleteMany !== undefined) {
        await db.delete(programTracks).where(eq(programTracks.trackId, where.id));
      }
      if (data.programs.create) {
        for (const p of data.programs.create) {
          await db.insert(programTracks).values({
            id: generateId(),
            programId: p.programId,
            trackId: where.id,
          });
        }
      }
    }

    return db.query.tracks.findFirst({
      where: eq(tracks.id, where.id),
      with: include?.programs ? { programs: { with: { program: true } } } : undefined,
    });
  },

  async delete({ where }: { where: { id: string } }) {
    const track = await db.query.tracks.findFirst({ where: eq(tracks.id, where.id) });
    await db.delete(tracks).where(eq(tracks.id, where.id));
    return track;
  },
};

// Component model
const componentModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    return db.query.components.findFirst({
      where: eq(components.id, where.id),
      with: include?.learningLine ? { learningLine: true } : undefined,
    });
  },

  async findMany(options?: { where?: any; include?: any; orderBy?: any }) {
    let whereClause;
    if (options?.where?.learningLineId) {
      whereClause = eq(components.learningLineId, options.where.learningLineId);
    }

    return db.query.components.findMany({
      where: whereClause,
      orderBy: [asc(components.order), asc(components.name)],
      with: options?.include?.learningLine ? { learningLine: true } : undefined,
    });
  },

  async create({ data, include }: { data: { name: string; learningLineId: string; order?: number }; include?: any }) {
    const id = generateId();
    await db.insert(components).values({
      id,
      name: data.name,
      learningLineId: data.learningLineId,
      order: data.order || 0
    });
    return db.query.components.findFirst({
      where: eq(components.id, id),
      with: include?.learningLine ? { learningLine: true } : undefined,
    });
  },

  async update({ where, data }: { where: { id: string }; data: { name?: string; learningLineId?: string; order?: number } }) {
    const updateData: any = { updatedAt: new Date() };
    if (data.name) updateData.name = data.name;
    if (data.learningLineId) updateData.learningLineId = data.learningLineId;
    if (data.order !== undefined) updateData.order = data.order;
    await db.update(components).set(updateData).where(eq(components.id, where.id));
    return db.query.components.findFirst({ where: eq(components.id, where.id) });
  },

  async delete({ where }: { where: { id: string } }) {
    const component = await db.query.components.findFirst({ where: eq(components.id, where.id) });
    await db.delete(components).where(eq(components.id, where.id));
    return component;
  },
};

// Content model
const contentModel = {
  async findUnique({ where, include }: { where: { id: string }; include?: any }) {
    return db.query.contents.findFirst({
      where: eq(contents.id, where.id),
      with: include ? {
        program: include.program || undefined,
        learningLine: include.learningLine || undefined,
        component: include.component || undefined,
        track: include.track || undefined,
        course: include.course || undefined,
        createdBy: include.createdBy || undefined,
      } : undefined,
    });
  },

  async findFirst({ where, include }: { where: any; include?: any }) {
    const conditions = [];
    if (where.programId) conditions.push(eq(contents.programId, where.programId));
    if (where.learningLineId) conditions.push(eq(contents.learningLineId, where.learningLineId));
    if (where.componentId) conditions.push(eq(contents.componentId, where.componentId));
    if (where.trackId) conditions.push(eq(contents.trackId, where.trackId));
    if (where.courseId) conditions.push(eq(contents.courseId, where.courseId));

    return db.query.contents.findFirst({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: include ? {
        program: include.program || undefined,
        learningLine: include.learningLine || undefined,
        component: include.component || undefined,
        track: include.track || undefined,
        course: include.course || undefined,
        createdBy: include.createdBy || undefined,
      } : undefined,
    });
  },

  async findMany(options?: { where?: any; include?: any; orderBy?: any }) {
    const conditions = [];
    if (options?.where?.programId) conditions.push(eq(contents.programId, options.where.programId));
    if (options?.where?.learningLineId) conditions.push(eq(contents.learningLineId, options.where.learningLineId));
    if (options?.where?.componentId) conditions.push(eq(contents.componentId, options.where.componentId));
    if (options?.where?.trackId) conditions.push(eq(contents.trackId, options.where.trackId));
    if (options?.where?.courseId) conditions.push(eq(contents.courseId, options.where.courseId));

    return db.query.contents.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(contents.updatedAt)],
      with: options?.include ? {
        program: options.include.program || undefined,
        learningLine: options.include.learningLine || undefined,
        component: options.include.component || undefined,
        track: options.include.track || undefined,
        course: options.include.course || undefined,
        createdBy: options.include.createdBy || undefined,
      } : undefined,
    });
  },

  async create({ data, include }: {
    data: {
      richTextBody: string;
      programId: string;
      learningLineId: string;
      componentId: string;
      trackId: string;
      courseId: string;
      createdById: string
    };
    include?: any
  }) {
    const id = generateId();
    await db.insert(contents).values({
      id,
      richTextBody: data.richTextBody,
      programId: data.programId,
      learningLineId: data.learningLineId,
      componentId: data.componentId,
      trackId: data.trackId,
      courseId: data.courseId,
      createdById: data.createdById,
    });

    return db.query.contents.findFirst({
      where: eq(contents.id, id),
      with: include ? {
        program: include.program || undefined,
        learningLine: include.learningLine || undefined,
        component: include.component || undefined,
        track: include.track || undefined,
        course: include.course || undefined,
        createdBy: include.createdBy || undefined,
      } : undefined,
    });
  },

  async update({ where, data, include }: {
    where: { id: string };
    data: { richTextBody?: string };
    include?: any
  }) {
    const updateData: any = { updatedAt: new Date() };
    if (data.richTextBody) updateData.richTextBody = data.richTextBody;

    await db.update(contents).set(updateData).where(eq(contents.id, where.id));

    return db.query.contents.findFirst({
      where: eq(contents.id, where.id),
      with: include ? {
        program: include.program || undefined,
        learningLine: include.learningLine || undefined,
        component: include.component || undefined,
        track: include.track || undefined,
        course: include.course || undefined,
        createdBy: include.createdBy || undefined,
      } : undefined,
    });
  },

  async upsert({ where, create, update, include }: {
    where: any;
    create: any;
    update: any;
    include?: any;
  }) {
    const existing = await contentModel.findFirst({ where, include: undefined });

    if (existing) {
      return contentModel.update({ where: { id: existing.id }, data: update, include });
    } else {
      return contentModel.create({ data: create, include });
    }
  },

  async delete({ where }: { where: { id: string } }) {
    const content = await db.query.contents.findFirst({ where: eq(contents.id, where.id) });
    await db.delete(contents).where(eq(contents.id, where.id));
    return content;
  },
};

// Export prisma-compatible interface
export const prisma = {
  user: userModel,
  program: programModel,
  course: courseModel,
  learningLine: learningLineModel,
  track: trackModel,
  component: componentModel,
  content: contentModel,
  $transaction: async <T>(fn: (tx: typeof prisma) => Promise<T>): Promise<T> => {
    // Simple implementation - Drizzle handles transactions differently
    return fn(prisma);
  },
};
