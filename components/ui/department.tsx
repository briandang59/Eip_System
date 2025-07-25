import { Button, Input, Modal, Select } from 'antd';
import { FileExcelOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import { GenericTable } from '../common/GenericTable';
import { useDepartmentCols } from '@/utils/constants/cols/departmentCols';
import { UnitType } from '@/types/response/unit';
import { useUnits } from '@/apis/useSwr/units';
import { useState } from 'react';
import { useCategory } from '@/apis/useSwr/unitCategory';
import DepartmentForm from '../forms/DepartmentForm';
import { useExportToExcel } from '@/utils/hooks/useExportToExcel';

function Department() {
    const { t } = useTranslationCustom();
    const departmentCols = useDepartmentCols();
    const [search, setSearch] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);

    const typeOptions = [
        { label: 'Product', value: 1 },
        { label: 'Office', value: 2 },
    ];
    const [classId, setClassId] = useState<number>(typeOptions[0].value);
    const [categoryId, setCategoryId] = useState<number>();

    const { units, isLoading: isLoadingUnits } = useUnits(
        { classid: classId },
        { search, category_id: categoryId },
    );

    const { categories, isLoading: isLoadingCategories } = useCategory();

    const { exportBasic } = useExportToExcel(departmentCols, 'Department', 'Department');
    const handleExportExcel = () => {
        if (!units || units.length === 0) return;
        exportBasic(units);
    };

    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
    };
    return (
        <div>
            <div className="flex flex-wrap items-end gap-2 mb-4">
                <Button icon={<PlusOutlined />} onClick={toggleModal}>
                    {t.utils.add}
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
                    {t.utils.export}
                </Button>
                <Button icon={<ReloadOutlined />}>{t.utils.refresh}</Button>
                <Input.Search
                    placeholder={t.utils.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={setSearch}
                    style={{ width: 200 }}
                    allowClear
                />
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.utils.type}</span>
                    <Select
                        placeholder={t.utils.search}
                        style={{ width: 200 }}
                        allowClear
                        options={typeOptions}
                        onChange={(value) => setClassId(value)}
                        value={classId}
                        loading={isLoadingUnits}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{t.utils.category}</span>
                    <Select
                        placeholder={t.utils.search}
                        style={{ width: 200 }}
                        allowClear
                        options={categories?.map((category) => ({
                            label: category.name_en || category.name_zh || category.name_vn,
                            value: category.id,
                        }))}
                        onChange={(value) => setCategoryId(value)}
                        value={categoryId}
                        loading={isLoadingCategories}
                    />
                </div>
            </div>
            <GenericTable<UnitType>
                columns={departmentCols}
                dataSource={units || []}
                rowKey="id"
                isLoading={isLoadingUnits}
                summary={() => null}
                pagination={{
                    defaultPageSize: 30,
                    pageSizeOptions: ['30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    size: 'default',
                }}
            />
            <Modal open={isOpenModal} centered footer={null} width={700}>
                {categories && <DepartmentForm close={toggleModal} categories={categories} />}
            </Modal>
        </div>
    );
}

export default Department;
