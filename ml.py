import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def LinearRegression(data):

	return 0

def LinearRegression(X, Y):

	#_ Calculate means
	x_len = len(X)
	y_len = len(Y)

	x_mean = sum(X) / x_len
	y_mean = sum(Y) / y_len

	#_ Calculate sum of squares
	sum_xx = [0, 0]
	sum_xy = [0, 0]

	for i in range(x_len):
		sum_xx[0] += (X[i] - x_mean) ** 2
		sum_xx[1] += X[i] ** 2

		sum_xy[0] += (X[i] - x_mean) * (Y[i] - y_mean)
		sum_xy[1] += (X[i] * Y[i])

	sum_xx[1] = (sum_xx[1] / x_len) - (x_mean ** 2)
	sum_xy[1] = (sum_xy[1] / x_len) - (x_mean * y_mean)

	b = [sum_xy[0] / sum_xx[0], sum_xy[1] / sum_xx[1]]

	intercept = [y_mean - (b[0] * x_mean), y_mean - (b[1] * x_mean)]

    return b, intercept