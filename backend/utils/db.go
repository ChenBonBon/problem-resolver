package utils

import "strconv"

func AutoQueryPlaceholder(arr []string, start int) string {
	return "$" + strconv.Itoa(len(arr)+start)
}