import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import axios from 'axios';

import IconButton from '../../components/button';
import Home from '../home';
import DrawerRight from '../../components/drawer';
import BasketPage from '../basket';
import ProductCard from '../productCard';
import ContentAdd from './../../../node_modules/material-ui/svg-icons/content/add';
import {getCategories, getTypesByCategoryId, setType, setCategory} from '../../actions/categoryActions'
import {
    saveProduct
} from '../../actions/productActions'

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            disableType: true,
            disabledButton: true,
            product: {
                model: '',
                description: '',
                price: '',
                productTypeId: 0
            }
        };
        this.getCategories();
    }

    openDrawer() {
        console.log('123');
        this.setState({
            openDrawer: !this.state.openDrawer,
            disableType: true
        });
    }

    getCategories() {
        axios.get('http://localhost:8080/product-category',
            {headers: {"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}}).then(response => {
            this.props.onGetCategories(response.data);
        });
    }

    setSelectedCategory(selectedValue) {
        this.setState({
            openDrawer: this.state.openDrawer,
            disableType: false,
            product: this.state.product
        });
        this.props.onSetCategory(selectedValue);
    }

    setSelectedType(event, index, selectedValue) {
        if (!(selectedValue === null)) {
            let selectedType = this.props.types.find(function (el) {
                return el.id == selectedValue;
            });
            this.props.onSetType(selectedType);
            this.setState({
                openDrawer: this.state.openDrawer,
                disableType: false,
                product: {
                    model: this.state.product.model,
                    description: this.state.product.description,
                    price: this.state.product.price,
                    productTypeId: selectedValue
                }
            });
        }
    }

    getTypesByCategoryId(event, index, category) {
        if (!(category === null)) {
            let selectedValue = this.props.categoryList.find(function (el) {
                return el.id == category;
            });
            this.setSelectedCategory(selectedValue);
            axios.get('http://localhost:8080/product-type/' + category,
                {headers: {"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}}).then(response => {
                this.props.onGetTypesByCategoryId(response.data);
            });
        }
    }

    onSave() {
        if (!(this.state.product.model === '' ||
                this.state.product.price === '' ||
                this.state.product.description === '' ||
                this.state.product.productTypeId === 0)) {
            let self = this;
            axios({
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                url: 'http://localhost:8080/product',
                data: this.state.product
            })
                .then(response => {
                    console.log(response);
                    if(Object.keys(self.props.active_type).length > 0 && self.props.active_type.id === self.state.product.productTypeId){
                        self.props.onSaveProduct(response.data);
                    }
                    self.setState({
                        openDrawer: false,
                        disableType: true,
                        disabledButton: true,
                        product: {
                            model: '',
                            description: '',
                            price: '',
                            productTypeId: 0
                        }
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    onChangeModel(event, value) {
        this.setState({
            openDrawer: this.state.openDrawer,
            disableType: false,
            product: {
                model: value,
                description: this.state.product.description,
                price: this.state.product.price,
                productTypeId: this.state.product.productTypeId
            }
        });
    }

    onChangeDescription(event, value) {
        this.setState({
            openDrawer: this.state.openDrawer,
            disableType: false,
            product: {
                model: this.state.product.model,
                description: value,
                price: this.state.product.price,
                productTypeId: this.state.product.productTypeId
            }
        });
    }

    onChangePrice(event, value) {
        this.setState({
            openDrawer: this.state.openDrawer,
            disableType: false,
            product: {
                model: this.state.product.model,
                description: this.state.product.description,
                price: value,
                productTypeId: this.state.product.productTypeId
            }
        });
    }

    render() {
        return (
            <div className="content">
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/basket' component={BasketPage}/>
                    <Route path='/product/:productId' component={ProductCard}/>
                </Switch>
                <IconButton onClick={() => this.openDrawer()}
                            backgroundColor="#2BB2AC"
                            children={<ContentAdd/>}
                />
                <DrawerRight
                    title={'Create new product'}
                    active_type={'ADD_PRODUCT'}
                    disableType={this.props.newProduct.disableType}
                    selectedCategory={this.props.category}
                    selectedType={this.props.type}
                    onChangeModel={(event, value) => this.onChangeModel(event, value)}
                    onChangeDescription={(event, value) => this.onChangeDescription(event, value)}
                    onChangePrice={(event, value) => this.onChangePrice(event, value)}
                    onChangeCategory={(event, index, selectedValue) => this.getTypesByCategoryId(event, index, selectedValue)}
                    onChangeType={(event, index, selectedValue) => this.setSelectedType(event, index, selectedValue)}
                    types={this.props.types}
                    onSave={() => this.onSave()}
                    categoryList={this.props.categoryList}
                    openDrawer={this.state.openDrawer}
                    onClose={() => this.openDrawer()}/>

            </div>
        );
    }

}

export default connect(
    state => ({
        categoryList: state.categoryReducer.categoryList,
        types: state.categoryReducer.types,
        category: state.categoryReducer.category,
        newProduct: state.productReducer.newProduct,
        type: state.categoryReducer.type,
        active_type: state.categoryReducer.active_type
    }),
    dispatch => ({
        onGetTypesByCategoryId: (types) => {
            dispatch(getTypesByCategoryId(types));
        },
        onGetCategories: (categoryList) => {
            dispatch(getCategories(categoryList));
        },
        onSetType: (type) => {
            dispatch(setType(type));
        },
        onSetCategory: (category) => {
            dispatch(setCategory(category));
        },
        onSaveProduct: (product) => {
            dispatch(saveProduct(product))
        }
    })
)(Content);