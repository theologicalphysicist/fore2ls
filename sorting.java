import java.util.*;
import java.lang.*;
import java.io.*;

class mergesorter {
	public static int[] mergesort(int[] arr, int len) {
		int[] Split1 = Arrays.copyOfRange(arr, 0, (int) len / 2); int len1 = Split1.length;
		int[] Split2 = Arrays.copyOfRange(arr, (int) len / 2, len); int len2 = Split2.length;

		if (len1 != 1) {
			Split1 = mergesort(Split1, len1);
		}
		if (len2 != 1) {
			Split2 = mergesort(Split2, len2);
		}

		return merge(Split1, Split2);
	}

	public static int[] merge(int[] s1, int[] s2) {
		int l1 = 0; int l2 = 0; int mi = 0;
		int s1len = s1.length; int s2len = s2.length;
		int[] merged = new int[s1len + s2len];
		boolean end = true;

		while (end) {
			if (s1[l1] < s2[l2]) {
				merged[mi] = s1[l1];
				l1++;
			} else {
				merged[mi] = s2[l2];
				l2++;
			}
			mi++;
			if (s1len == l1) {
				for (int i = l2; l2 < s2len; l2++) {
					merged[mi] = s2[l2]; mi++;
				}
				end = false;
			}
			if (s2len == l2) {
				for (int i = l1; l1 < s1len; l1++) {
					merged[mi] = s1[l1]; mi++;
				}
				end = false;
			}
		}
		return merged;
	}
}