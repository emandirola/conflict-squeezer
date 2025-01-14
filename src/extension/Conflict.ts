"use strict";

import { Constants } from "./Constants";

export class Conflict {
    public hasOriginal: boolean = false;

    private textAfterMarkerOurs: string | undefined = undefined;
    private textAfterMarkerOriginal: string | undefined = undefined;
    private textAfterMarkerTheirs: string | undefined = undefined;
    private textAfterMarkerEnd: string | undefined = undefined;

    private ourLines: string[] = [];
    private originalLines: string[] = [];
    private theirLines: string[] = [];

    public getSqueezedText(): string {
        const minNumberOfLines: number = Math.min(this.ourLines.length, this.theirLines.length);
        const maxNumberOfLines: number = Math.max(this.ourLines.length, this.theirLines.length);

        // Top cursor will contain the number of identical lines from the top.
        // Bottom cursor will contain the number of identical lines from the bottom.
        let topCursor: number = 0;
        let bottomCursor: number = 0;

        while (topCursor < minNumberOfLines) {
            const ourLine: string = this.ourLines[topCursor];
            const theirLine: string = this.theirLines[topCursor];

            if (ourLine.trim() === theirLine.trim()) {
                topCursor++;
            } else {
                break;
            }
        }

        // We need to subtract topCursor, to ensure that topCursor + bottomCursor <= minNumberOfLines
        while (bottomCursor < minNumberOfLines - topCursor) {
            const ourLine: string = this.ourLines[this.ourLines.length - 1 - bottomCursor];
            const theirLine: string = this.theirLines[this.theirLines.length - 1 - bottomCursor];

            if (ourLine.trim() === theirLine.trim()) {
                bottomCursor++;
            } else {
                break;
            }
        }

        const identicalTopLines: string[] = this.ourLines.slice(0, topCursor);

        const identicalBottomLines: string[] = this.ourLines.slice(
            this.ourLines.length - bottomCursor, this.ourLines.length);

        let parts: string[];

        if (topCursor + bottomCursor === maxNumberOfLines) {
            parts = [
                ...identicalTopLines,
                ...identicalBottomLines
            ];
        } else {
            const ourNonIdenticalLines: string[] =
                this.ourLines.slice(topCursor, this.ourLines.length - bottomCursor);

            const theirNonIdenticalLines: string[] =
                this.theirLines.slice(topCursor, this.theirLines.length - bottomCursor);

            let originalParts: string[];

            if (this.hasOriginal) {
                originalParts = [
                    Constants.conflictMarkerOriginal + this.textAfterMarkerOriginal,
                    ...this.originalLines
                ];
            } else {
                originalParts = [];
            }

            parts = [
                ...identicalTopLines,
                Constants.conflictMarkerOurs + this.textAfterMarkerOurs,
                ...ourNonIdenticalLines,
                ...originalParts,
                Constants.conflictMarkerTheirs + this.textAfterMarkerTheirs,
                ...theirNonIdenticalLines,
                Constants.conflictMarkerEnd + this.textAfterMarkerEnd,
                ...identicalBottomLines
            ];
        }

        return parts.filter(part => part.length > 0).join("");
    }

    public addOriginalLine(line: string): void {
        this.originalLines.push(line);
    }

    public addOurLine(line: string): void {
        this.ourLines.push(line);
    }

    public addTheirLine(line: string): void {
        this.theirLines.push(line);
    }

    public setTextAfterMarkerEnd(text: string): void {
        this.textAfterMarkerEnd = text;
    }

    public setTextAfterMarkerOriginal(text: string): void {
        this.textAfterMarkerOriginal = text;
    }

    public setTextAfterMarkerOurs(text: string): void {
        this.textAfterMarkerOurs = text;
    }

    public setTextAfterMarkerTheirs(text: string): void {
        this.textAfterMarkerTheirs = text;
    }
}