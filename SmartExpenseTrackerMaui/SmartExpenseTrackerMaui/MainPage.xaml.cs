using Microsoft.Maui.Controls;
using Microsoft.Maui.Controls.Shapes;
using Microsoft.Maui.Graphics;
using System;
using System.Collections.Generic;
using System.Globalization;
using Button = Microsoft.Maui.Controls.Button;

namespace SmartExpenseTrackerMaui;

public partial class MainPage : ContentPage
{
    // Expense data model
    private sealed class Expense
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }

    // Stores expenses during the current application session
    private readonly List<Expense> _expenses = new();

    private string _selectedCategory = "Food";

    public MainPage()
    {
        InitializeComponent();
        UpdateCategoryButtons();
        UpdateDashboard();
    }

    // Category selection events
    private void OnFoodClicked(object? sender, EventArgs e)
    {
        SelectCategory("Food");
    }

    private void OnTravelClicked(object? sender, EventArgs e)
    {
        SelectCategory("Travel");
    }

    private void OnShoppingClicked(object? sender, EventArgs e)
    {
        SelectCategory("Shopping");
    }

    private void OnOtherClicked(object? sender, EventArgs e)
    {
        SelectCategory("Other");
    }

    private void SelectCategory(string category)
    {
        _selectedCategory = category;
        UpdateCategoryButtons();
    }

    // Update category button appearance
    private void UpdateCategoryButtons()
    {
        SetCategoryStyle(FoodButton, "Food");
        SetCategoryStyle(TravelButton, "Travel");
        SetCategoryStyle(ShoppingButton, "Shopping");
        SetCategoryStyle(OtherButton, "Other");
    }

    private void SetCategoryStyle(
        Microsoft.Maui.Controls.Button button,
        string category)
    {
        bool selected = _selectedCategory == category;

        button.BackgroundColor = selected
            ? Color.FromArgb("#E8F0FF")
            : Colors.White;

        button.TextColor = selected
            ? Color.FromArgb("#1D4ED8")
            : Color.FromArgb("#475569");

        button.BorderColor = selected
            ? Color.FromArgb("#2563EB")
            : Color.FromArgb("#E2E8F0");

        button.FontAttributes = selected
            ? FontAttributes.Bold
            : FontAttributes.None;
    }

    // Add an expense
    private async void OnAddExpenseClicked(
        object? sender,
        EventArgs e)
    {
        string description =
            DescriptionEntry.Text?.Trim() ?? string.Empty;

        string amountText =
            AmountEntry.Text?.Trim() ?? string.Empty;

        // Validate description
        if (string.IsNullOrWhiteSpace(description))
        {
            await DisplayAlertAsync(
                "Missing description",
                "Please enter an expense name.",
                "OK");

            DescriptionEntry.Focus();
            return;
        }

        // Accept decimal amounts using either a dot or the current
        // system's decimal separator.
        bool validAmount = decimal.TryParse(
            amountText,
            NumberStyles.Number,
            CultureInfo.CurrentCulture,
            out decimal amount);

        if (!validAmount)
        {
            validAmount = decimal.TryParse(
                amountText,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out amount);
        }

        if (!validAmount || amount <= 0)
        {
            await DisplayAlertAsync(
                "Invalid amount",
                "Enter a valid amount greater than zero.",
                "OK");

            AmountEntry.Focus();
            return;
        }

        string icon = _selectedCategory switch
        {
            "Food" => "🍔",
            "Travel" => "🚌",
            "Shopping" => "🛍️",
            _ => "📦"
        };

        Expense expense = new()
        {
            Description = description,
            Amount = amount,
            Category = _selectedCategory,
            Icon = icon
        };

        // Put the newest expense at the top
        _expenses.Insert(0, expense);

        DescriptionEntry.Text = string.Empty;
        AmountEntry.Text = string.Empty;

        UpdateDashboard();
    }

    // Delete an expense after confirmation
    private async void OnDeleteExpenseClicked(
        object? sender,
        EventArgs e)
    {
        if (sender is not Microsoft.Maui.Controls.Button button ||
            button.CommandParameter is not Expense expense)
        {
            return;
        }

        bool confirmed = await DisplayAlertAsync(
            "Delete expense",
            $"Delete '{expense.Description}'?",
            "Delete",
            "Cancel");

        if (!confirmed)
        {
            return;
        }

        _expenses.Remove(expense);
        UpdateDashboard();
    }

    // Refresh totals, count, empty state and list
    private void UpdateDashboard()
    {
        decimal total = 0;

        foreach (Expense expense in _expenses)
        {
            total += expense.Amount;
        }

        TotalLabel.Text = $"₹{total:N2}";

        TotalCountLabel.Text =
            $"{_expenses.Count} expense" +
            (_expenses.Count == 1 ? "" : "s") +
            " recorded";

        ExpenseCountBadge.Text = _expenses.Count.ToString();

        EmptyState.IsVisible = _expenses.Count == 0;

        ExpensesList.Children.Clear();

        foreach (Expense expense in _expenses)
        {
            ExpensesList.Children.Add(CreateExpenseCard(expense));
        }
    }

    // Create the visual card for an expense
    private View CreateExpenseCard(Expense expense)
    {
        Label iconLabel = new()
        {
            Text = expense.Icon,
            FontSize = 24,
            HorizontalOptions = LayoutOptions.Center,
            VerticalOptions = LayoutOptions.Center
        };

        Border iconBox = new()
        {
            BackgroundColor = Color.FromArgb("#F1F5FF"),
            StrokeThickness = 0,
            WidthRequest = 48,
            HeightRequest = 48,
            StrokeShape = new RoundRectangle
            {
                CornerRadius = 12
            },
            Content = iconLabel
        };

        Label descriptionLabel = new()
        {
            Text = expense.Description,
            FontSize = 15,
            FontAttributes = FontAttributes.Bold,
            TextColor = Color.FromArgb("#172554"),
            LineBreakMode = LineBreakMode.TailTruncation
        };

        Label categoryLabel = new()
        {
            Text = $"{expense.Category} · Expense",
            FontSize = 12,
            TextColor = Color.FromArgb("#64748B")
        };

        VerticalStackLayout details = new()
        {
            Spacing = 4,
            VerticalOptions = LayoutOptions.Center,
            Children =
            {
                descriptionLabel,
                categoryLabel
            }
        };

        Label amountLabel = new()
        {
            Text = $"₹{expense.Amount:N2}",
            FontSize = 16,
            FontAttributes = FontAttributes.Bold,
            TextColor = Color.FromArgb("#1D4ED8"),
            HorizontalTextAlignment = TextAlignment.End
        };

        Microsoft.Maui.Controls.Button deleteButton = new()
        {
            Text = "Delete",
            FontSize = 12,
            TextColor = Color.FromArgb("#DC2626"),
            BackgroundColor = Colors.Transparent,
            Padding = new Thickness(8, 4),
            HeightRequest = 32,
            HorizontalOptions = LayoutOptions.End,
            CommandParameter = expense
        };

        deleteButton.Clicked += OnDeleteExpenseClicked;

        VerticalStackLayout amountSection = new()
        {
            Spacing = 2,
            HorizontalOptions = LayoutOptions.End,
            VerticalOptions = LayoutOptions.Center,
            Children =
            {
                amountLabel,
                deleteButton
            }
        };

        Grid layout = new()
        {
            ColumnDefinitions =
            {
                new ColumnDefinition
                {
                    Width = GridLength.Auto
                },
                new ColumnDefinition
                {
                    Width = GridLength.Star
                },
                new ColumnDefinition
                {
                    Width = GridLength.Auto
                }
            },
            ColumnSpacing = 12,
            VerticalOptions = LayoutOptions.Center
        };

        layout.Add(iconBox, 0, 0);
        layout.Add(details, 1, 0);
        layout.Add(amountSection, 2, 0);

        Border card = new()
        {
            BackgroundColor = Colors.White,
            Stroke = Color.FromArgb("#E6ECF5"),
            StrokeThickness = 1,
            Padding = 14,
            StrokeShape = new RoundRectangle
            {
                CornerRadius = 14
            },
            Content = layout
        };

        return card;
    }
}