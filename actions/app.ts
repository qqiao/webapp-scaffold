import { Action, ActionCreator, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { Page } from "../data/app";

export interface GetAllPagesFunction<S, P extends Page> {
  (state: S): P[] | undefined;
}

export interface PageLoaderFunction<P extends Page> {
  (page?: P): Promise<void>;
}

interface PageResolution<P extends Page> {
  page?: P;
  params?: string;
}

export enum ActionTypes {
  UPDATE_PAGE = "[app] update page",
}

export interface ActionUpdatePage<P extends Page>
  extends Action<ActionTypes.UPDATE_PAGE> {
  page?: P;
  params?: string;
}

export const createNavigateFunction =
  <S, P extends Page>(
    getAllPages: GetAllPagesFunction<S, P>,
    pageLoader: PageLoaderFunction<P>
  ): ActionCreator<ThunkAction<void, S, unknown, ActionUpdatePage<P>>> =>
  (path: string) =>
  async (dispatch, getState) => {
    const allPages = getAllPages(getState());

    const { page, params } = resolvePage(path, allPages);
    await pageLoader(page);

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
export const resolvePage = <P extends Page>(
  path: string,
  pages?: P[]
): PageResolution<P> => {
  let bestMatch: P | undefined;
  pages?.some((page) => {
    // When path exactly matches the URL pattern, we know for certain that
    // this is the best possible match
    if (path === page.urlPattern) {
      bestMatch = page;
      return true;
    }

    if (
      path.startsWith(page.urlPattern) &&
      (!bestMatch || page.urlPattern.length > bestMatch.urlPattern?.length)
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
