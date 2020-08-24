import * as tru from "@shah/traverse-urls";
import * as ur from "@shah/uniform-resource";

export interface MetascraperResults {
  [key: string]: any;
}

export interface MetascraperResultsSupplier {
  readonly metascraperResults: MetascraperResults;
}

export function isMetascraperResultsSupplier(o: any): o is MetascraperResultsSupplier {
  return o && "metascraperResults" in o;
}

const metascraperRulesCommon = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
]);

const metascraperRulesAll = require('metascraper')([
  require('metascraper-audio')(),
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-media-provider')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-spotify')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-video')(),
  require('metascraper-youtube')()
]);

export class EnrichMetascraperResults implements ur.UniformResourceTransformer {
  static readonly commonRules = new EnrichMetascraperResults(metascraperRulesCommon);
  static readonly allRules = new EnrichMetascraperResults(metascraperRulesAll);

  constructor(readonly metascraperInstance: any) {
  }

  async flow(ctx: ur.ResourceTransformerContext, resource: ur.UniformResource): Promise<ur.UniformResource | (ur.UniformResource & MetascraperResultsSupplier)> {
    let result: ur.UniformResource | (ur.UniformResource & MetascraperResultsSupplier) = resource;
    if (ur.isFollowedResource(resource) && tru.isTerminalTextContentResult(resource.terminalResult)) {
      // TODO should we check if mimeType is text/html?
      const textResult = resource.terminalResult;
      result = {
        ...resource,
        // This is expensive since we're creating a second copy of cheerio for Metascraper
        // but Metascraper needs its own, decorated, HTML DOM.
        metascraperResults: await this.metascraperInstance({
          html: resource.terminalResult.contentText,
          url: resource.uri
        }),
      };
    }
    return result;
  }
}

