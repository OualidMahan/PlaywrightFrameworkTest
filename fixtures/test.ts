import { test as base, expect } from "@playwright/test";

import { buildPageFixtures, creerPageRegistry, type PageInstances } from "@automation/framework";
import { resolve } from "node:path";
import type { DiscoveredPages } from "../generated/page-registry.generated";

const pageClasses = creerPageRegistry(resolve(__dirname, "../pages")) as DiscoveredPages;

type MyFixtures = PageInstances<typeof pageClasses>;

export const test = base.extend<MyFixtures>(buildPageFixtures(pageClasses));

export { expect };
