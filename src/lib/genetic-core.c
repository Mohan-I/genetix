// genetic-core.c - High-performance C implementation for WebAssembly
#include <stdint.h>
#include <math.h>
#include <stdlib.h>

// Polygenic risk scoring with O(n) complexity
float compute_polygenic_risk(float* variants, float* weights, int length) {
    float risk_score = 0.0f;
    float sum_weights = 0.0f;
    
    for (int i = 0; i < length; i++) {
        risk_score += variants[i] * weights[i];
        sum_weights += weights[i];
    }
    
    return risk_score / sum_weights;
}

// Monte Carlo simulation for genetic crossing
void monte_carlo_cross(uint32_t* p1_genes, uint32_t* p2_genes, int gene_count, 
                       int iterations, float* output_distribution) {
    #pragma omp parallel for
    for (int iter = 0; iter < iterations; iter++) {
        float combined_score = 0.0f;
        
        for (int i = 0; i < gene_count; i++) {
            // Random allele selection (Mendelian inheritance)
            uint32_t selected = (rand() % 2 == 0) ? p1_genes[i] : p2_genes[i];
            combined_score += (selected & 0xFF) / 255.0f;
        }
        
        output_distribution[iter] = combined_score / gene_count;
    }
}

// Bayesian update with conjugate priors
void bayesian_update(float* prior, float* likelihood, float* posterior, int size) {
    float evidence = 0.0f;
    
    // Compute marginal likelihood
    for (int i = 0; i < size; i++) {
        evidence += prior[i] * likelihood[i];
    }
    
    // Bayes' theorem: P(θ|x) = P(x|θ)P(θ) / P(x)
    for (int i = 0; i < size; i++) {
        posterior[i] = (likelihood[i] * prior[i]) / evidence;
    }
}

// Matrix multiplication for polygenic layers
void matrix_multiply(float* A, float* B, float* C, int m, int n, int p) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < p; j++) {
            float sum = 0.0f;
            for (int k = 0; k < n; k++) {
                sum += A[i * n + k] * B[k * p + j];
            }
            C[i * p + j] = sum;
        }
    }
}