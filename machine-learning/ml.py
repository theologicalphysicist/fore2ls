import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def DotProduct(v1:list, v2:list)\
	-> float:

	ans = 0
	for i in range(0, len(v1)):
		ans += v1[i] * v2[i]
	
	return ans

def LinearRegression(X:list, Y:list, calc:str = "BGD", alpha:float = 0.01, batch_size:int = 10)\
	-> list():
	#TODO - INSERT DOCSTRINGS WITH OPTIONS FOR CALCULATIONS

	calc_options = [["SGD", "STOCHASTIC", "S", "STOCHASTIC GRADIENT DESCENT"], ["MINI-BATCH", "MB", "MINI-BATCH GRADIENT DESCENT", "MBGD", "M-BGD"]]

	if (calc.upper() in calc_options[0]):
		return SGD(X, Y)
	elif (calc.upper() in calc_options[1]):
		return MBGD(X, Y, alpha, batch_size)
	else:
		return BGD(X, Y, alpha)

def BGD(X:list, Y:list, alpha:float = 0.01):

	theta:list = [1] * len(X[0])

	for j in range(0, len(X[0])):
		theta_adj = theta
		for i in range(0, len(X[0])):
			_hyp = DotProduct(X[i], theta)
			theta_adj[i] = (_hyp - Y[i]) * X[i][j]
		theta[j] -= alpha * theta_adj[j]

	return theta

def SGD(X:list, Y:list):

	#TODO - Stochastic Gradient Descent
	
	return 0

def MBGD(X:list, Y:list, alpha:float, b_s:int):

	#TODO - Mini-batch Gradient Descent

	return 0
	
def LinearRegressionSimple(X, Y):

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

	return (b, intercept)