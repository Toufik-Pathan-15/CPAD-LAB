using System;
using Microsoft.Maui.Controls;

namespace Lab5AppMAUI
{
    public partial class MainPage : ContentPage
    {
        private int count = 0;

        public MainPage()
        {
            InitializeComponent();
        }

        private void IncrementClicked(
            object? sender, EventArgs e)
        {
            count++;
            UpdateDisplay();
        }

        private void DecrementClicked(
            object? sender, EventArgs e)
        {
            count--;
            UpdateDisplay();
        }

        private void ResetClicked(
            object? sender, EventArgs e)
        {
            count = 0;
            UpdateDisplay();
        }

        private void UpdateDisplay()
        {
            CountLabel.Text = count.ToString();
        }
    }
}