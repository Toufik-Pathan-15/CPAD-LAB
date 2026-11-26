
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Category = 'Food' | 'Travel' | 'Shopping' | 'Other';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
};

type ExpenseCardProps = {
  expense: Expense;
  onDelete: (id: string) => void;
};

const categories: Category[] = [
  'Food',
  'Travel',
  'Shopping',
  'Other',
];

const categoryIcons: Record<Category, string> = {
  Food: '🍔',
  Travel: '🚌',
  Shopping: '🛍️',
  Other: '📦',
};

// Child component: receives data through Props.
function ExpenseCard({ expense, onDelete }: ExpenseCardProps) {
  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseIcon}>
        <Text style={styles.iconText}>
          {categoryIcons[expense.category]}
        </Text>
      </View>

      <View style={styles.expenseInfo}>
        <Text style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseCategory}>
          {expense.category}
        </Text>
      </View>

      <View style={styles.amountArea}>
        <Text style={styles.expenseAmount}>
          ₹{expense.amount.toFixed(2)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${expense.title}`}
          onPress={() => onDelete(expense.id)}
          hitSlop={8}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Index() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const addExpense = () => {
    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      Alert.alert('Missing description', 'Enter an expense name.');
      return;
    }

    if (!amount.trim() || !Number.isFinite(numericAmount) ||
        numericAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Enter an amount greater than zero.'
      );
      return;
    }

    const newExpense: Expense = {
      id: `${Date.now()}-${Math.random()}`,
      title: cleanTitle,
      amount: Math.round(numericAmount * 100) / 100,
      category,
    };

    setExpenses((previous) => [newExpense, ...previous]);
    setTitle('');
    setAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>PERSONAL FINANCE</Text>
              <Text style={styles.headerTitle}>Expense Tracker</Text>
              <Text style={styles.headerSubtitle}>
                Manage your daily spending
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Text style={styles.walletIcon}>₹</Text>
            </View>
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
            <Text style={styles.totalAmount}>
              ₹{total.toFixed(2)}
            </Text>
            <View style={styles.totalFooter}>
              <Text style={styles.totalNote}>
                {expenses.length} expense
                {expenses.length === 1 ? '' : 's'} recorded
              </Text>
              <Text style={styles.totalEmoji}>↗</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Add an expense</Text>
            <Text style={styles.sectionSubtitle}>NEW ENTRY</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Expense description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lunch, Bus ticket"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
              returnKeyType="next"
            />

            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              value={amount}
              onChangeText={(value) => {
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setAmount(value);
                }
              }}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[
                      styles.categoryButton,
                      selected && styles.categorySelected,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>
                      {categoryIcons[item]}
                    </Text>
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={addExpense}
            >
              <Text style={styles.addButtonText}>
                +  Add Expense
              </Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent expenses</Text>
            <Text style={styles.countBadge}>{expenses.length}</Text>
          </View>

          {expenses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🧾</Text>
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first expense above to get started.
              </Text>
            </View>
          ) : (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={deleteExpense}
              />
            ))
          )}

          <Text style={styles.footer}>
            Smart Expense Tracker · Your money, organized.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 22,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#64748B',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#172554',
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#DCEBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    fontSize: 29,
    fontWeight: '800',
    color: '#2563EB',
  },
  totalCard: {
    backgroundColor: '#245BE8',
    borderRadius: 22,
    padding: 23,
    marginBottom: 27,
  },
  totalLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 12,
  },
  totalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#6087F0',
  },
  totalNote: {
    color: '#E0EAFF',
    fontSize: 13,
  },
  totalEmoji: {
    color: '#FFFFFF',
    fontSize: 21,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172554',
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 15,
    color: '#172554',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    flexGrow: 1,
    flexBasis: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  categorySelected: {
    backgroundColor: '#E8F0FF',
    borderColor: '#2563EB',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#245BE8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  countBadge: {
    backgroundColor: '#DCE8FF',
    color: '#1D4ED8',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: '800',
    overflow: 'hidden',
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E6ECF5',
    padding: 13,
    marginBottom: 10,
  },
  expenseIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 21,
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  expenseTitle: {
    color: '#172554',
    fontSize: 14,
    fontWeight: '800',
  },
  expenseCategory: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
  },
  amountArea: {
    alignItems: 'flex-end',
    marginLeft: 6,
  },
  expenseAmount: {
    color: '#172554',
    fontSize: 14,
    fontWeight: '800',
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6ECF5',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    color: '#172554',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },
  footer: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 25,
  },
});
