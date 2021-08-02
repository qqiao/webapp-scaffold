import { Action, ActionCreator, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { Page } from "../data/app";

export interface GetAllPagesFunction {
  (): Page[] | undefined;
}

export interface PageLoaderFunction {
  (page?: Page, params?: string): Promise<void>;
}

interface PageResolution {
  page?: Page;
  params?: string;
}

export enum ActionTypes {
  UPDATE_PAGE = "[app] update page",
}

export interface ActionUpdatePage extends Action<ActionTypes.UPDATE_PAGE> {
  page?: Page;
  params?: string;
}

export const createNavigateFunction =
  <S>(
    getAllPages: GetAllPagesFunction,
    pageLoader: PageLoaderFunction
  ): ActionCreator<ThunkAction<void, S, unknown, ActionUpdatePage>> =>
  (path: string) =>
  async (dispatch) => {
    const allPages = getAllPages();

    const { page, params } = resolvePage(path, allPages);
    await pageLoader(page, params);

    return dispatch({ type: ActionTypes.UPDATE_PAGE, page, params });
  };

/**
 * resolvePage takes a given path and a list of pages and finds the page with
 * the urlPattern that best matches the given path.
 *
 * When a page is found, the rest of the path is considered as params for the
 * page.
 *
 * @param path the path to search for a page that best matches
 * @param pages the list of pages
 */
export const resolvePage = (path: string, pages?: Page[]): PageResolution => {
  let bestMatch: Page | undefined;
  pages?.some((page) => {
    // When path exactly matches the URL pattern, we know for certain that
    // this is the best possible match
    if (path === page.urlPattern) {
      bestMatch = page;
      return true;
    }

    if (
      path.startsWith(page.urlPattern) &&
      (!bestMatch || page.urlPattern.length > bestMatch?.urlPattern?.length)
    ) {
      bestMatch = page;
    }
    return false;
  });

  let params: string | undefined;
  if (bestMatch) {
    const _params = path.replace(bestMatch.urlPattern, "");
    if (_params.length > 0) params = _params;
  }
  return {
    page: bestMatch,
    params,
  };
};
