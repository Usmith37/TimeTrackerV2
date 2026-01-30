import React, { useEffect, useState, forwardRef, useMemo } from 'react';

const CustomTable = forwardRef(({ columns, loadData }, ref) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    const filteredData = useMemo(() => {
        return data.filter(item => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                const cellValue = String(item[key]).toLowerCase();
                const filterValue = filters[key].toLowerCase();
                return cellValue.includes(filterValue);
            });
        });
    }, [data, filters]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await loadData();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [loadData]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="table-container">
            <div className="table-controls">
                <button onClick={clearFilters}>Сбросить фильтры</button>
            </div>
            <table ref={ref}>
                <thead>
                <tr>
                    {columns.map(col => (
                        <th key={`header-${col.key}`} style={{ width: col.width || 'auto' }}>
                            {col.label}
                        </th>
                    ))}
                </tr>
                {/* Строка с фильтрами */}
                <tr className="filter-row">
                    {columns.map(col => (
                        col.key === 'actions' ? (
                            <td key={`filter-${col.key}`}></td>
                        ) : (
                            <td key={`filter-${col.key}`}>
                                <input
                                    type="text"
                                    placeholder={`Фильтр: ${col.label}`}
                                    value={filters[col.key] || ''}
                                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </td>
                        )
                    ))}
                </tr>
                </thead>
                <tbody>
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <tr key={`row-${index}`}>
                            {columns.map(col => (
                                <td key={`cell-${col.key}-${index}`}>
                                    {col.render
                                        ? col.render.length === 1
                                            ? col.render(item[col.key])
                                            : col.render(item[col.key], item)
                                        : item[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                            Нет данных, соответствующих фильтрам
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
});

export default CustomTable;