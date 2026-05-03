import streamlit as st
import plotly.graph_objects as go
import random
from logic import get_nice_ticks # Импортируем нашу логику

# Константы стиля
PRIMARY_COLOR = "#b56ea9"
CHART_HEIGHT = 600

def run_app():
    st.set_page_config(page_title="Data Visualizer Pro", layout="wide")
    st.title("📊 Инструмент визуализации данных")

    # --- САЙДБАР ---
    st.sidebar.header("Настройки")
    
    if st.sidebar.button("🔀 Генерировать случайные данные"):
        count = random.randint(20, 40)
        val = random.randint(100, 500)
        vals = [val]
        for _ in range(count - 1):
            val += random.randint(-50, 50)
            vals.append(val)
        st.session_state['data_input'] = ", ".join(map(str, vals))

    data_str = st.sidebar.text_area(
        "Данные для графика (через запятую):", 
        value=st.session_state.get('data_input', "124, 450, 300, 800"),
        height=150
    )

    col1, col2 = st.sidebar.columns(2)
    u_min_input = col1.text_input("Лимит Y min", "")
    u_max_input = col2.text_input("Лимит Y max", "")
    n_target = st.sidebar.select_slider("Плотность сетки (тикеров)", options=range(2, 21), value=7)

    # --- ОСНОВНАЯ ЛОГИКА ---
    try:
        # 1. Валидация данных
        y_values = [float(x.strip()) for x in data_str.split(",") if x.strip()]
        
        if not y_values:
            st.info("Ожидание ввода данных...")
            return

        # 2. Расчет масштабирования
        d_min, d_max = min(y_values), max(y_values)
        auto_ticks = get_nice_ticks(d_min, d_max, n_target=n_target)
        
        # Определяем границы (ручные или авто)
        f_min = float(u_min_input) if u_min_input else min(auto_ticks)
        f_max = float(u_max_input) if u_max_input else max(auto_ticks)
        
        # Пересчитываем тики под финальные границы
        final_ticks = get_nice_ticks(f_min, f_max, n_target=n_target)
        visible_ticks = [t for t in final_ticks if f_min <= t <= f_max]

        # 3. Построение графика
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            y=y_values, 
            mode='lines+markers',
            line=dict(color=PRIMARY_COLOR, width=3),
            marker=dict(size=8, color=PRIMARY_COLOR),
            hovertemplate="Значение: %{y}<br>Точка: %{x}<extra></extra>"
        ))

        fig.update_layout(
            hovermode="x unified",
            template="plotly_white",
            margin=dict(l=40, r=40, t=20, b=40),
            yaxis=dict(
                range=[f_min, f_max],
                tickvals=visible_ticks,
                gridcolor='#f0f0f0',
                zeroline=False,
                title="Значение"
            ),
            xaxis=dict(gridcolor='#f0f0f0', title="Порядковый номер"),
            height=CHART_HEIGHT
        )

        st.plotly_chart(fig, use_container_width=True)
        
        # Дополнительная фишка для портфолио: таблица данных
        with st.expander("Посмотреть сырые данные"):
            st.dataframe({"Y": y_values}, use_container_width=True)

    except ValueError:
        st.error("❌ Ошибка: Убедитесь, что в поле данных только числа, разделенные запятыми.")
    except Exception as e:
        st.error(f"⚠️ Произошла непредвиденная ошибка: {e}")

if __name__ == "__main__":
    run_app()
