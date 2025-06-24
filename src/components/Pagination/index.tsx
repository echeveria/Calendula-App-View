import { component$, $ } from "@builder.io/qwik";

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
      <div class="flex justify-center mt-4 space-x-2">
        <button
          class="btn btn-sm"
          onClick$={onPrevPage}
          disabled={currentPage <= 1}
        >
          Предишна
        </button>

        <div class="join">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageToShow;
            if (totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageToShow = i + 1;
            } else {
              // Calculate which pages to show
              const startPage = Math.max(
                1,
                Math.min(currentPage - 2, totalPages - 4)
              );
              pageToShow = startPage + i;
            }

            return (
              <button
                key={pageToShow}
                class={`join-item btn btn-sm ${pageToShow === currentPage ? "btn-active" : ""}`}
                onClick$={() => onGoToPage(pageToShow)}
              >
                {pageToShow}
              </button>
            );
          })}
        </div>

        <button
          class="btn btn-sm"
          onClick$={onNextPage}
          disabled={currentPage >= totalPages}
        >
          Следваща
        </button>

        <span class="self-center text-sm">
          Страница {currentPage} от {totalPages}
        </span>
      </div>
    );
  }
);
