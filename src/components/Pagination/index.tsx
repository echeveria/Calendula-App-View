import { component$ } from "@builder.io/qwik";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

export const Pagination = component$<PaginationProps>(
  ({ currentPage, totalPages, onPrevPage, onNextPage, onGoToPage }) => {
    return (
      <div class="flex flex-col items-center gap-2 mt-4">
        <div class="flex items-center gap-1 sm:gap-2">
          <button class="btn btn-xs sm:btn-sm" onClick$={onPrevPage} disabled={currentPage <= 1}>
            <span class="hidden sm:inline">Предишна</span>
            <span class="sm:hidden">&laquo;</span>
          </button>

          <div class="join">
            {Array.from({ length: Math.min(totalPages <= 3 ? totalPages : 3, totalPages) }, (_, i) => {
              let pageToShow;
              if (totalPages <= 3) {
                pageToShow = i + 1;
              } else {
                const startPage = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
                pageToShow = startPage + i;
              }

              return (
                <button
                  key={pageToShow}
                  class={`join-item btn btn-xs sm:btn-sm ${pageToShow === currentPage ? "btn-active" : ""}`}
                  onClick$={() => onGoToPage(pageToShow)}
                >
                  {pageToShow}
                </button>
              );
            })}
          </div>

          <button class="btn btn-xs sm:btn-sm" onClick$={onNextPage} disabled={currentPage >= totalPages}>
            <span class="hidden sm:inline">Следваща</span>
            <span class="sm:hidden">&raquo;</span>
          </button>
        </div>

        <span class="text-xs sm:text-sm text-base-content/70">
          {currentPage} / {totalPages}
        </span>
      </div>
    );
  }
);
