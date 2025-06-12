import { Pin } from '@/types';
import { SortOption, DateRange } from '@/types/boardpage.types';

export class BoardFiltersService {
  static filterBySearch(pins: Pin[], query: string): Pin[] {
    if (!query) return pins;

    const lowerQuery = query.toLowerCase();
    return pins.filter(
      pin =>
        pin.title.toLowerCase().includes(lowerQuery) ||
        pin.description?.toLowerCase().includes(lowerQuery) ||
        pin.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  static filterByTags(pins: Pin[], selectedTags: string[]): Pin[] {
    if (selectedTags.length === 0) return pins;

    return pins.filter(pin =>
      pin.tags?.some(tag => selectedTags.includes(tag))
    );
  }

  static filterByDateRange(pins: Pin[], dateRange: DateRange): Pin[] {
    if (dateRange === 'all') return pins;

    const now = new Date();
    const cutoff = new Date();

    switch (dateRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }
    return pins.filter(pin => new Date(pin.createdAt) >= cutoff);
  }

  static sortPins(pins: Pin[], sortBy: SortOption): Pin[] {
    const sortedPins = [...pins];

    switch (sortBy) {
      case 'newest':
        return sortedPins.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return sortedPins.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'title':
        return sortedPins.sort((a, b) => a.title.localeCompare(b.title));
      case 'mostLiked':
        return sortedPins.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sortedPins;
    }
  }

  static getAllTags(pins: Pin[]): string[] {
    const tagSet = new Set<string>();
    pins.forEach(pin => {
      pin.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  static applyAllFilters(
    pins: Pin[],
    searchQuery: string,
    selectedTags: string[],
    dateRange: DateRange,
    sortBy: SortOption
  ): Pin[] {
    let filtered = pins;

    filtered = this.filterBySearch(filtered, searchQuery);
    filtered = this.filterByTags(filtered, selectedTags);
    filtered = this.filterByDateRange(filtered, dateRange);
    filtered = this.sortPins(filtered, sortBy);

    return filtered;
  }
}

export class BoardShareService {
  static async shareBoard(board: { id: string; title: string }): Promise<void> {
    const shareUrl = `${window.location.origin}/boards/${board.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: board.title,
          text: `Check out my board: ${board.title}`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        await this.copyToClipboard(shareUrl);
      }
    } else {
      await this.copyToClipboard(shareUrl);
    }
  }

  private static async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      // You can show a toast notification here
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}

export class BoardExportService {
  static exportBoardAsJSON(board: any): void {
    const dataStr = JSON.stringify(board, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${board.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  static async exportBoardAsMarkdown(board: any): Promise<void> {
    let markdown = `# ${board.title}\n\n`;

    if (board.description) {
      markdown += `${board.description}\n\n`;
    }

    markdown += `**Created:** ${new Date(board.createdAt).toLocaleDateString()}\n`;
    markdown += `**Pins:** ${board.pins.length}\n\n`;

    if (board.pins.length > 0) {
      markdown += `## Pins\n\n`;

      board.pins.forEach((pin: any, index: number) => {
        markdown += `### ${index + 1}. ${pin.title}\n\n`;
        if (pin.description) {
          markdown += `${pin.description}\n\n`;
        }
        markdown += `![${pin.title}](${pin.imageUrl})\n\n`;
        if (pin.tags && pin.tags.length > 0) {
          markdown += `**Tags:** ${pin.tags.join(', ')}\n\n`;
        }
        markdown += `**Created:** ${new Date(pin.createdAt).toLocaleDateString()}\n\n`;
        markdown += '---\n\n';
      });
    }

    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${board.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();

    URL.revokeObjectURL(link.href);
  }
}
