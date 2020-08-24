import * as p from "@shah/ts-pipe";
import * as ur from "@shah/uniform-resource";
import * as urMs from "./uniform-resource-metascraper";
import { Expect, Test, TestFixture, Timeout } from "alsatian";

@TestFixture("Uniform Resource Test Suite")
export class TestSuite {
    @Test("Test a single, valid, UniformResourceContent for Metascraper's common meta data")
    async testCommonRulesMetascraperResults(): Promise<void> {
        const tr = p.pipe(new ur.FollowRedirectsGranular(), urMs.EnrichMetascraperResults.commonRules);
        const resource = await ur.acquireResource({ uri: "https://www.foxnews.com/lifestyle/photo-of-donald-trump-look-alike-in-spain-goes-viral", transformer: tr });
        Expect(resource).toBeDefined();
        Expect(urMs.isMetascraperResultsSupplier(resource)).toBe(true);
        if (urMs.isMetascraperResultsSupplier(resource)) {
            Expect(resource.metascraperResults).toBeDefined();
            console.dir(resource.metascraperResults);
        }
    }

    @Timeout(45000) // use high timeout since doing extended meta data takes time
    @Test("Test a single, valid, UniformResourceContent for Metascraper's extended meta data")
    async testAllRulesMetascraperResults(): Promise<void> {
        const tr = p.pipe(new ur.FollowRedirectsGranular(), urMs.EnrichMetascraperResults.allRules);
        const resource = await ur.acquireResource({ uri: "https://www.foxnews.com/lifestyle/photo-of-donald-trump-look-alike-in-spain-goes-viral", transformer: tr });
        Expect(resource).toBeDefined();
        Expect(urMs.isMetascraperResultsSupplier(resource)).toBe(true);
        if (urMs.isMetascraperResultsSupplier(resource)) {
            Expect(resource.metascraperResults).toBeDefined();
            console.dir(resource.metascraperResults);
        }
    }
}
