import React, { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';
import { Input } from './Input';
import { CheckBoxIcon, CheckBoxSelectedIcon, Close, SearchManageIcon, SearchOffIcon } from '../../../public/icons/Svg';
import cutString from '../../utils/cutString';
import convertDate from '../../utils/convertDate';
import { WindowCard } from './WindowCard';
import { useSelector } from 'react-redux';
import { Card } from './Card';


const variants = {
    sm: {className: 'text-sm p-1', size: 'small'},
    md: {className: 'text-md p-2', size: ''},
    lg: {className: 'text-lg p-3', size: 'large'},
    xl: {className: 'text-xl p-4', size: 'large'},
};

const getFieldVal = (field, array1, array2) => {
    let result;
  
    for (const item of array1) {
        const currentField = item.field;
        if (currentField === field) {
            const itemParts = currentField.split('.');
            result = array2;
            for (const part of itemParts) {
                if (result && result.hasOwnProperty(part)) {
                    result = result[part];
                } else {
                    result = undefined;
                    break;
                }
            }
            break; 
        }
    }
    return result;
}

const actionParams = (object, params) => {
    const props = {};

    for (const key in params) {
        if(typeof params[key] === 'string'){
            if (params[key].startsWith('%') && params[key].endsWith('%') ) {
                const paramName = params[key].slice(1, -1); // Elimina los '%' al inicio y al final
                props[key] = object.hasOwnProperty(paramName) ? object[paramName] : paramName;
            } else {
                props[key] = params[key];
            }
        }
        else props[key] = params[key];
    }
    return props;
}

export const Table = ({
    element = null, // Component required!
    header = [], 
    items = [], 
    className = "",
    size = "sm",
    title = null,
    check = null,
    actions = {
        header: '',
        params: {},
        component: null
    },
}) => {

    const [select, setSelect] = useState([]);
    const [searchText, setSearchText] = useState(""); 
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [currentPage, setCurrentPage] = useState(1);
    const [cols, setCols] = useState(header.length)

    const darkMode = useSelector( (state) => state.darkMode );

    const getCols = () => {
        
        let totalCols = cols

        if(actions.component) {
            totalCols ++
        }
        if(check) {
            totalCols ++
        }

        setCols(totalCols)
    }

    const handleSelect = (valor) => {
        if (select.includes(valor)) {
            setSelect(select.filter(item => item !== valor));
        } else {
            setSelect([...select, valor]);
        }
    };

    const filteredItems = items?.filter(item => {
        return Object.values(item || {}).some(value => {
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(subValue => {
                    if (typeof subValue === 'string' && subValue !== null) {
                        return subValue.toString().toLowerCase().includes(searchText.toLowerCase());
                    }
                    return false;
                });
            }
            if (value !== null) {
                return value.toString().toLowerCase().includes(searchText.toLowerCase());
            }
            return false;
        });
    });
    
    const renderCellContent = (tr, th) => {
        if (th.img) {
          const imgSrc = th.img.replace("%FIELD%", tr[th.field]);
          return (
            <div className="flex items-center justify-center">
              <img src={imgSrc} className="max-w-[30px] hover:scale-125 transition-all duration-200 ease-in-out" />
            </div>
          );
        }
        if (th.wordWrap) {
          return cutString(getFieldVal(th.field, header, tr), th.wordWrap);
        }
        if (th.date) {
          return convertDate(tr[th.field]);
        }
        if (th.function) {
          return th.function.func(getFieldVal(th.field, header, tr));
        }

        return getFieldVal(th.field, header, tr);
    }

    const [totalItems, setTotalItems] = useState(filteredItems.length)
    const [totalPages, setTotalPages] = useState(Math.ceil(totalItems / itemsPerPage))

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    const onRowsChange = (e) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1);
    }

    const cleanSearch = (e) => {
        setSearchText("")
    }

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setTotalItems(filteredItems.length)
    }, [filteredItems])

    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / itemsPerPage))
    }, [totalItems, itemsPerPage])

    useEffect(() => {
        getCols()
    }, [])
    
    return (
        <Card className="!p-0 overflow-auto">
            <table className={`w-full overflow-hidden ${className}`}>
                <thead className="bg-admin-light-600/50 dark:bg-admin-dark-600/50">
                    { element && 
                        <tr>
                            <th colSpan={cols}>
                                <div className="px-4 pt-4">
                                    {React.cloneElement(element, { selectedElements: select, setSelectedElements: setSelect })}
                                </div>
                            </th>
                        </tr>
                    }
                    <tr>
                        <th colSpan={cols}>
                            <div className={`flex flex-wrap min-w-max ${title ? 'justify-between' : 'justify-end'} items-center font-normal gap-4 p-4`}>
                                { title && <h3 className="font-semibold text-lg">{title}</h3> }
                                <Input
                                    icon={<SearchManageIcon color={ darkMode ? "#00ffff" : "#292929"}/>}
                                    id="searchInput"
                                    name="searchInput"
                                    placeholder="Search"
                                    className="!rounded-full border-gray-200 dark:border-admin-dark-700 px-3"
                                    size={size}
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    element={
                                        <button onClick={cleanSearch}>
                                            <Close size={20} color={ darkMode ? "#00ffff" : "#292929"}/>
                                        </button>
                                    }
                                />
                            </div>
                        </th>
                    </tr>
                    <tr className="border-b border-light-primary-500 dark:border-dark-primary-500 bg-admin-light-600 dark:bg-admin-dark-600/50">
                        { check && <th></th> }
                        { header.map(th => (
                            <th className={`${variants[size].className} p-4`} key={th.field}>
                                <td key={th.field}>{th.name}</td>
                            </th>
                        )) }
                        { actions.component && <th className={`${variants[size].className} p-4`}>{actions.header}</th> }
                    </tr>
                </thead>
                <tbody className="bg-admin-light-600/50 dark:bg-admin-dark-600/50">
                    {
                        currentItems.length > 0 ?
                            currentItems.map(tr => (
                                <tr className={`border-b border-light-primary-500 dark:border-dark-primary-500 hover:bg-admin-light-600 dark:hover:bg-admin-dark-600 ${variants[size].className}`} key={tr}>
                                    {check &&
                                        <td>
                                            <div className="flex items-center justify-center px-4 py-2">
                                                <button onClick={() => handleSelect(getFieldVal(check, header, tr))}>
                                                    { select.includes(getFieldVal(check, header, tr)) ? <CheckBoxSelectedIcon color={ darkMode ? "#00ffff" : "#292929"}/> : <CheckBoxIcon color={ darkMode ? "#00ffff" : "#292929"}/> }
                                                </button>                                            
                                            </div>
                                        </td>
                                    }
                                    { header.map(th => (
                                        <td className="px-4 py-2" key={th.field} colSpan={th.colSpan || 1}>
                                           { renderCellContent(tr, th) }
                                        </td>
                                    )) }
                                    { actions.component && <td>{React.cloneElement(actions.component, actionParams(tr, actions?.params))}</td> }
                                </tr>
                            ))
                        :
                        <tr>
                            <td colSpan={cols}>
                                <span className="flex flex-grow justify-center items-center gap-4 p-4 text-2xl font-medium">
                                    <SearchOffIcon size="35" color={ darkMode ? "#00ffff" : "#292929"}/>
                                    No results found
                                </span>
                            </td>
                        </tr>                    
                    }
                </tbody>
                <tfoot className="bg-admin-light-600/50 dark:bg-admin-dark-600/50">
                    <tr>
                        <th colSpan={cols}>
                            <div className={`flex flex-wrap gap-4 justify-between items-center p-4 ${variants[size].className}`}>
                                <span className="dark:text-white font-normal">Rows: {totalItems}</span>
                                <div className="flex flex-wrap gap-4">
                                    <label htmlFor="tableRows" className="flex gap-4 items-center rounded-full p-1 px-3 
                                        bg-white dark:bg-white/80 border border-light-primary-500 dark:border-dark-primary-500 text-black font-normal"
                                    >
                                        Rows:
                                        <select
                                            id="tableRows" 
                                            className="bg-transparent border-0 focus-visible:outline-none" 
                                            onChange={(e) => onRowsChange(e)}>
                                            <option defaultValue={15} selected>15</option>
                                            <option defaultValue={25}>25</option>
                                            <option defaultValue={30}>30</option>
                                            <option defaultValue={50}>50</option>
                                        </select>
                                    </label>
                                    <div className="p-1 rounded-full bg-white dark:bg-white/80 border border-light-primary-500 dark:border-dark-primary-500">
                                        <Pagination
                                            count={totalPages}
                                            page={currentPage}
                                            onChange={onPageChange}
                                            size={variants[size].size}
                                            showFirstButton showLastButton
                                        />
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </tfoot>
            </table>                       
        </Card>
    )
}
