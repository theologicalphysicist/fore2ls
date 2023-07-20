// File for printing char* arrays, and converting between char* arrays and strings
// #include <stdio.h>
#include <iostream>
#include <string>

using namespace std;


char *split(char *str, int start, int len) {

	char *str_ptr = (char *) calloc(0, sizeof(char));
	int str_count = 0;

	for (int i = start; i < len; i++) {
		str_count++;
		str_ptr = (char *) realloc(str_ptr, str_count * sizeof(char));
		str_ptr[str_count - 1] = str[i];
	}

	return str_ptr;
}

char *stocp(string s, int len) {
	char *out = (char *) calloc(len, sizeof(char));

	for (int i = 0; i < len; i++) {
		out[i] = s[i];
	}

	return out;
}

string cptos(char *in, int len) {
	string out = "";

	for (int i = 0; i < len; i++) {
		// printf("%s\n", d);
		out += in[i];
		// printf("%s\n", out);
	}

	return out;
}

void printcp(char *in, int len) {
	for (int i = 0; i < len; i++) {
		printf("%c\n", in[i]);
	}
}
